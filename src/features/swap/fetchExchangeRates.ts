import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { MAX_EXCHANGE_SPREAD } from 'src/config/consts'
import { getExchangeContract } from 'src/config/tokenMapping'
import { NativeTokenId, StableTokenIds } from 'src/config/tokens'
import { ExchangeRate, ToCeloRates } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { areRatesStale } from 'src/utils/time'

interface FetchExchangeRatesParams {
  kit: MiniContractKit
}

export type AccountBalances = Record<NativeTokenId, string>

export const fetchExchangeRates = createAsyncThunk<
  ToCeloRates | null,
  FetchExchangeRatesParams,
  { dispatch: AppDispatch; state: AppState }
>('swap/fetchExchangeRates', async (params, thunkAPI) => {
  const { kit } = params
  const toCeloRates = thunkAPI.getState().swap.toCeloRates
  if (areRatesStale(toCeloRates)) {
    logger.debug('Fetching exchange rates')
    const newRates: ToCeloRates = {}
    for (const tokenId of StableTokenIds) {
      const rate = await _fetchExchangeRates(kit, tokenId)
      newRates[tokenId] = rate
    }
    return newRates
  } else {
    return null
  }
})

async function _fetchExchangeRates(
  kit: MiniContractKit,
  tokenId: NativeTokenId
): Promise<ExchangeRate> {
  const contract = await getExchangeContract(kit, tokenId)
  const spread = await contract.spread()
  if (spread.lt(0) || spread.gt(MAX_EXCHANGE_SPREAD))
    throw new Error(`Invalid exchange spread: ${spread}`)

  const [celoBucket, stableBucket] = await contract.getBuyAndSellBuckets(false)
  if (celoBucket.lte(0) || stableBucket.lte(0))
    throw new Error(
      `Invalid exchange buckets: ${celoBucket.toString()}, ${stableBucket.toString()}`
    )
  return {
    celoBucket: celoBucket.toString(),
    stableBucket: stableBucket.toString(),
    spread: spread.toString(),
    lastUpdated: Date.now(),
  }
}
