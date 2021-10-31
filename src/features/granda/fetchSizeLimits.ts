import type { ContractKit } from '@celo/contractkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { SizeLimits } from 'src/features/granda/types'
import { getNativeTokenId } from 'src/features/swap/contracts'

interface FetchSizeLimitsParams {
  kit: ContractKit
}

export const fetchSizeLimits = createAsyncThunk<
  SizeLimits | null,
  FetchSizeLimitsParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchSizeLimits', async (params, thunkAPI) => {
  const { kit } = params
  const sizeLimits = thunkAPI.getState().granda.sizeLimits
  if (!sizeLimits) {
    return _fetchSizeLimits(kit)
  } else {
    return null
  }
})

async function _fetchSizeLimits(kit: ContractKit): Promise<SizeLimits> {
  const contract = await kit.contracts.getGrandaMento()
  const configMap = await contract.getAllStableTokenLimits()
  const sizeLimits: SizeLimits = {}
  for (const [name, limits] of configMap.entries()) {
    const tokenId = getNativeTokenId(name)
    sizeLimits[tokenId] = {
      min: limits.minExchangeAmount.toFixed(0),
      max: limits.maxExchangeAmount.toFixed(0),
    }
  }
  return sizeLimits
}
