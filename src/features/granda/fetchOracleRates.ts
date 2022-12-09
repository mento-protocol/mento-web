import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { MAX_EXCHANGE_RATE, MIN_EXCHANGE_RATE } from 'src/config/consts'
import { nativeTokenToKitToken } from 'src/config/tokenMapping'
import { NativeTokenId, StableTokenIds } from 'src/config/tokens'
import { getSortedOracles } from 'src/contract-wrappers/sorted-oracles'
import { OracleRates } from 'src/features/granda/types'
import { SimpleExchangeRate } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { areRatesStale } from 'src/utils/time'

interface FetchOracleRatesParams {
  kit: MiniContractKit
}

export const fetchOracleRates = createAsyncThunk<
  OracleRates | null,
  FetchOracleRatesParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchOracleRates', async (params, thunkAPI) => {
  const { kit } = params
  const oracleRates = thunkAPI.getState().granda.oracleRates
  if (areRatesStale(oracleRates)) {
    logger.debug('Fetching oracle rates')
    const newRates: OracleRates = {}
    for (const tokenId of StableTokenIds) {
      const rate = await _fetchOracleRates(kit, tokenId)
      newRates[tokenId] = rate
    }
    return newRates
  } else {
    return null
  }
})

async function _fetchOracleRates(
  kit: MiniContractKit,
  tokenId: NativeTokenId
): Promise<SimpleExchangeRate> {
  const token = nativeTokenToKitToken(tokenId)
  const stableTokenAddress = await kit.celoTokens.getAddress(token)
  const sortedOracles = await getSortedOracles(kit)
  const { rate } = await sortedOracles.medianRate(stableTokenAddress)
  if (!rate || rate.lt(MIN_EXCHANGE_RATE) || rate.gt(MAX_EXCHANGE_RATE))
    throw new Error(`Invalid oracle rate ${rate}`)
  return {
    rate: rate.toNumber(),
    lastUpdated: Date.now(),
  }
}
