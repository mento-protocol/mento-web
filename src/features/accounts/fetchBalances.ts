import { createAsyncThunk } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/nextjs'
import { Contract } from 'ethers'
import { BALANCE_STALE_TIME } from 'src/config/consts'
import { TokenId, getTokenAddress, getTokenOptionsByChainId } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import type { AppDispatch, AppState } from 'src/features/store/store'
import { validateAddress } from 'src/utils/addresses'
import { isStale } from 'src/utils/time'
import { erc20ABI } from 'wagmi'

import { logger } from '../../utils/logger'

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

async function _fetchBalances(address: string, chainId: number): Promise<Record<TokenId, string>> {
  validateAddress(address, 'fetchBalances')
  const tokenBalances: Partial<Record<TokenId, string>> = {}

  const balancePromises = getTokenOptionsByChainId(chainId).map(async (tokenSymbol) => {
    const balance = await getTokenBalance({ address, chainId, tokenSymbol })
    return { tokenSymbol, balance }
  })

  const results = await Promise.allSettled(balancePromises)
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { tokenSymbol, balance } = result.value
      if (balance !== undefined) {
        tokenBalances[tokenSymbol] = balance
      }
    }
  })

  return tokenBalances as Record<TokenId, string>
}

async function getTokenBalance({
  address,
  chainId,
  tokenSymbol,
}: IGetTokenBalance): Promise<string | undefined> {
  const tokenAddress = getTokenAddress(tokenSymbol, chainId)
  const provider = getProvider(chainId)
  try {
    const tokenContract = new Contract(tokenAddress, erc20ABI, provider)
    return (await tokenContract.balanceOf(address)).toString()
  } catch (error) {
    logger.error(`Error on getting balance of '${tokenSymbol}' token.`, { error })
    Sentry.captureException(error)
    return undefined
  }
}

interface IGetTokenBalance {
  address: string
  chainId: number
  tokenSymbol: TokenId
}
