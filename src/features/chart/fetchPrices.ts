import { CeloContract } from '@celo/contractkit'
import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { Interface } from '@ethersproject/abi'
import { createAsyncThunk } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import type { AppDispatch, AppState } from 'src/app/store'
import { ABI as SortedOraclesAbi } from 'src/blockchain/ABIs/sortedOracles'
import { getLatestBlockDetails, getNumBlocksPerInterval } from 'src/blockchain/blocks'
import { config } from 'src/config/config'
import { MAX_TOKEN_PRICE_NUM_DAYS } from 'src/config/consts'
import { nativeTokenToKitToken } from 'src/config/tokenMapping'
import { NativeTokenId, StableTokenIds } from 'src/config/tokens'
import {
  BaseCurrencyPriceHistory,
  PairPriceUpdate,
  QuoteCurrency,
  QuoteCurrencyPriceHistory,
  TokenPricePoint,
} from 'src/features/chart/types'
import { findMissingPriceDays, mergePriceHistories } from 'src/features/chart/utils'
import { areAddressesEqual, ensureLeading0x } from 'src/utils/addresses'
import { fromFixidity } from 'src/utils/amount'
import {
  BlockscoutTransactionLog,
  queryBlockscout,
  validateBlockscoutLog,
} from 'src/utils/blockscout'
import { logger } from 'src/utils/logger'
import { sleep } from 'src/utils/timeout'

const DEFAULT_HISTORY_NUM_DAYS = 7
const SECONDS_PER_DAY = 86400
const BLOCK_FETCHING_INTERVAL_SIZE = 60 // 1 minutes
const PAUSE_BETWEEN_FETCH_REQUESTS = 250 // 1/4 second
const MAX_TIME_FROM_NOW_FOR_LOG = 600_000 // 10 minutes
const MEDIAN_UPDATED_TOPIC_0 = '0xa9981ebfc3b766a742486e898f54959b050a66006dbce1a4155c1f84a08bcf41'
const EXPECTED_MIN_CELO_TO_STABLE = 0.1
const EXPECTED_MAX_CELO_TO_STABLE = 100

let oracleInterface: Interface | undefined
let oracleAddress: string | undefined
const tokenAddresses: Partial<Record<NativeTokenId, string>> = {}

interface FetchTokenPriceParams {
  kit: MiniContractKit
  baseCurrency: NativeTokenId
  numDays?: number // 7 by default
}

export const fetchTokenPrice = createAsyncThunk<
  PairPriceUpdate[] | null,
  FetchTokenPriceParams,
  { dispatch: AppDispatch; state: AppState }
>('chart/fetchPrices', async (params, thunkAPI) => {
  const { kit, baseCurrency, numDays } = params
  const prices: BaseCurrencyPriceHistory = thunkAPI.getState().tokenPrice.prices
  const pairPriceUpdates = await _fetchTokenPrice(kit, prices, baseCurrency, numDays)
  return pairPriceUpdates
})

// Currently this only fetches CELO to stable token prices
// May eventually expand to fetch other pairs
async function _fetchTokenPrice(
  kit: MiniContractKit,
  prices: BaseCurrencyPriceHistory,
  baseCurrency: NativeTokenId,
  numDays = DEFAULT_HISTORY_NUM_DAYS
) {
  if (numDays > MAX_TOKEN_PRICE_NUM_DAYS) {
    throw new Error(`Cannot retrieve prices for such a wide window: ${numDays}`)
  }
  if (baseCurrency !== NativeTokenId.CELO) {
    throw new Error('Only CELO <-> Native currency is currently supported')
  }

  const pairPriceUpdates = await fetchStableTokenPrices(kit, numDays, prices[baseCurrency])
  return pairPriceUpdates
}

// Fetches token prices by retrieving and parsing the oracle reporting tx logs
async function fetchStableTokenPrices(
  kit: MiniContractKit,
  numDays: number,
  oldPrices?: QuoteCurrencyPriceHistory
) {
  const latestBlock = await getLatestBlockDetails(kit)
  if (!latestBlock) throw new Error('Latest block number needed for fetching prices')

  const missingDays = findMissingPriceDays(numDays, oldPrices)
  // Skip task if all needed days are already in store
  if (!missingDays.length) return null

  const oracleInterface = getOracleInterface()
  const numBlocksPerDay = getNumBlocksPerInterval(SECONDS_PER_DAY)
  const numBlocksPerInterval = getNumBlocksPerInterval(BLOCK_FETCHING_INTERVAL_SIZE)
  const priceUpdates: QuoteCurrencyPriceHistory = {}

  for (const day of missingDays) {
    const toBlock = latestBlock.number - numBlocksPerDay * day
    const fromBlock = toBlock - numBlocksPerInterval
    const tokenToPrice = await tryFetchOracleLogs(kit, fromBlock, toBlock, oracleInterface)
    if (!tokenToPrice) continue
    // Prepends the new price point to each tokens history
    for (const [id, price] of tokenToPrice) {
      if (!priceUpdates[id]) priceUpdates[id] = []
      priceUpdates[id]!.push(price)
    }
    await sleep(PAUSE_BETWEEN_FETCH_REQUESTS) // Brief pause to help avoid overloading blockscout and/or getting rate limited
  }

  const mergedPrices = mergePriceHistories(priceUpdates, oldPrices)

  const pairPriceUpdates: PairPriceUpdate[] = []
  for (const key of Object.keys(mergedPrices)) {
    const quoteCurrency = key as QuoteCurrency // TS limitation of Object.keys()
    const prices = mergedPrices[quoteCurrency]!
    pairPriceUpdates.push({ baseCurrency: NativeTokenId.CELO, quoteCurrency, prices })
  }
  return pairPriceUpdates
}

async function tryFetchOracleLogs(
  kit: MiniContractKit,
  fromBlock: number,
  toBlock: number,
  oracleInterface: Interface
) {
  try {
    const oracleAddress = await getOracleAddress(kit)
    const url = `${config.blockscoutUrl}/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${oracleAddress}&topic0=${MEDIAN_UPDATED_TOPIC_0}`
    const txLogs = await queryBlockscout<Array<BlockscoutTransactionLog>>(url)
    const pricePoints = await parseBlockscoutOracleLogs(kit, txLogs, oracleInterface, fromBlock)
    return pricePoints
  } catch (error) {
    logger.error(`Failed to fetch and parse oracle logs for blocks ${fromBlock}-${toBlock}`, error)
    return null
  }
}

async function parseBlockscoutOracleLogs(
  kit: MiniContractKit,
  logs: Array<BlockscoutTransactionLog>,
  oracleInterface: Interface,
  minBlock: number
) {
  const tokenToPrice = new Map<NativeTokenId, TokenPricePoint>()
  for (const id of StableTokenIds) {
    const tokenAddress = await getTokenAddress(kit, id)
    const price = parseBlockscoutOracleLogsForToken(logs, oracleInterface, tokenAddress, minBlock)
    if (price) tokenToPrice.set(id, price)
  }
  return tokenToPrice
}

function parseBlockscoutOracleLogsForToken(
  logs: Array<BlockscoutTransactionLog>,
  oracleInterface: Interface,
  searchToken: string,
  minBlock: number
): TokenPricePoint | null {
  if (!logs || !logs.length) throw new Error('No oracle logs found in time range')

  for (const log of logs) {
    try {
      validateBlockscoutLog(log, MEDIAN_UPDATED_TOPIC_0, minBlock)

      const filteredTopics = log.topics.filter((t) => !!t)
      const logDescription = oracleInterface.parseLog({
        topics: filteredTopics,
        data: log.data,
      })

      if (logDescription.name !== 'MedianUpdated') {
        throw new Error(`Unexpected log name: ${logDescription.name}`)
      }

      const { token, value } = logDescription.args
      if (!token || !value || !areAddressesEqual(token, searchToken)) {
        // Log is likely for a different token
        continue
      }

      const valueAdjusted = fromFixidity(value.toString()).toNumber()
      if (
        valueAdjusted <= EXPECTED_MIN_CELO_TO_STABLE ||
        valueAdjusted >= EXPECTED_MAX_CELO_TO_STABLE
      ) {
        throw new Error(`Invalid median value: ${value}`)
      }

      const timestamp = new BigNumber(ensureLeading0x(log.timeStamp)).times(1000)
      if (timestamp.lte(0) || timestamp.gt(Date.now() + MAX_TIME_FROM_NOW_FOR_LOG)) {
        throw new Error(`Invalid timestamp: ${log.timeStamp}`)
      }

      return { timestamp: timestamp.toNumber(), price: valueAdjusted }
    } catch (error) {
      logger.warn('Unable to parse token price log, will attempt next', error)
    }
  }

  logger.error(`All log parse attempts failed or no log found for token ${searchToken}`)
  return null
}

function getOracleInterface() {
  if (!oracleInterface) {
    oracleInterface = new Interface(SortedOraclesAbi)
  }
  return oracleInterface
}

async function getOracleAddress(kit: MiniContractKit) {
  if (!oracleAddress) {
    oracleAddress = await kit.registry.addressFor(CeloContract.SortedOracles)
  }
  return oracleAddress
}

async function getTokenAddress(kit: MiniContractKit, tokenId: NativeTokenId): Promise<string> {
  const cachedAddress = tokenAddresses[tokenId]
  if (cachedAddress) return cachedAddress

  const token = nativeTokenToKitToken(tokenId)
  const address = await kit.celoTokens.getAddress(token)
  tokenAddresses[tokenId] = address
  return address
}
