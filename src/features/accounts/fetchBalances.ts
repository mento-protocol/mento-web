import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { BALANCE_STALE_TIME } from 'src/config/consts'
import { TokenId } from 'src/config/tokens'
import type { AppDispatch, AppState } from 'src/features/store/store'
import { validateAddress } from 'src/utils/addresses'
import { isStale } from 'src/utils/time'

interface FetchBalancesParams {
  address: string
  kit: MiniContractKit
}

export type AccountBalances = Record<TokenId, string>

export const fetchBalances = createAsyncThunk<
  AccountBalances | null,
  FetchBalancesParams,
  { dispatch: AppDispatch; state: AppState }
>('accounts/fetchBalances', async (params, thunkAPI) => {
  const { address, kit } = params
  const lastUpdated = thunkAPI.getState().account.lastUpdated
  if (isStale(lastUpdated, BALANCE_STALE_TIME)) {
    const balances = await _fetchBalances(address, kit)
    return balances
  } else {
    return null
  }
})

async function _fetchBalances(address: string, kit: MiniContractKit) {
  validateAddress(address, 'fetchBalances')
  const balances = await kit.getTotalBalance(address)
  const filteredBalances: Partial<Record<TokenId, string>> = {}
  for (const tokenId of Object.keys(TokenId)) {
    // @ts-ignore
    filteredBalances[tokenId] = balances[tokenId].toString()
  }
  return filteredBalances as Record<TokenId, string>
}
