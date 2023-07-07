import { createAsyncThunk } from '@reduxjs/toolkit'
import { BigNumberish, Contract } from 'ethers'
import { BALANCE_STALE_TIME } from 'src/config/consts'
import { TokenId, getTokenAddress, getTokenOptionsByChainId } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import type { AppDispatch, AppState } from 'src/features/store/store'
import { validateAddress } from 'src/utils/addresses'
import { isStale } from 'src/utils/time'
import { erc20ABI } from 'wagmi'

interface FetchBalancesParams {
  address: string
  chainId: number
}

export type AccountBalances = Record<TokenId, string>

export const fetchBalances = createAsyncThunk<
  AccountBalances | null,
  FetchBalancesParams,
  { dispatch: AppDispatch; state: AppState }
>('accounts/fetchBalances', async (params, thunkAPI) => {
  const { address, chainId } = params
  const lastUpdated = thunkAPI.getState().account.lastUpdated
  if (isStale(lastUpdated, BALANCE_STALE_TIME)) {
    const balances = await _fetchBalances(address, chainId)
    return balances
  } else {
    return null
  }
})

async function _fetchBalances(address: string, chainId: number) {
  validateAddress(address, 'fetchBalances')
  const tokenBalances: Partial<Record<TokenId, string>> = {}
  for (const tokenId of getTokenOptionsByChainId(chainId)) {
    const tokenAddr = getTokenAddress(tokenId, chainId)
    const provider = getProvider(chainId)
    const tokenContract = new Contract(tokenAddr, erc20ABI, provider)
    const balance: BigNumberish = await tokenContract.balanceOf(address)
    tokenBalances[tokenId] = balance.toString()
  }
  return tokenBalances as Record<TokenId, string>
}
