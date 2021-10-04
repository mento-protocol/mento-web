import type { ContractKit } from '@celo/contractkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { EXCHANGE_RATE_STALE_TIME, MAX_EXCHANGE_SPREAD } from 'src/config/consts'
import { NativeTokenId, StableTokenIds } from 'src/config/tokens'
import { getExchangeContract } from 'src/features/swap/contracts'
import { ExchangeRate, ToCeloRates } from 'src/features/swap/types'
import { isStale } from 'src/utils/time'

interface FetchExchangeRatesParams {
  kit: ContractKit
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
    const newToCeloRates: ToCeloRates = {}
    for (const tokenId of StableTokenIds) {
      const rate = await _fetchExchangeRates(kit, tokenId)
      newToCeloRates[tokenId] = rate
    }
    return newToCeloRates
  } else {
    return null
  }
})

async function _fetchExchangeRates(
  kit: ContractKit,
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

function areRatesStale(rates: ToCeloRates) {
  return (
    !rates ||
    !Object.keys(rates).length ||
    Object.values(rates).some((r) => isStale(r.lastUpdated, EXCHANGE_RATE_STALE_TIME))
  )
}
