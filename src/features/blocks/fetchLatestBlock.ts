import type { ContractKit } from '@celo/contractkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import type { BlockHeader } from 'web3-eth'

interface FetchLatestBlockParams {
  kit: ContractKit
}

export const fetchLatestBlock = createAsyncThunk<
  BlockHeader,
  FetchLatestBlockParams,
  { dispatch: AppDispatch; state: AppState }
>('blocks/fetchLatestBlock', async (params) => {
  const { kit } = params
  const latest = await kit.web3.eth.getBlock('latest')
  return latest
})
