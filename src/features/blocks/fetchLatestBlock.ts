import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/features/store/store'
import type { BlockHeader } from 'web3-eth'

interface FetchLatestBlockParams {
  kit: MiniContractKit
}

export const fetchLatestBlock = createAsyncThunk<
  BlockHeader,
  FetchLatestBlockParams,
  { dispatch: AppDispatch; state: AppState }
>('blocks/fetchLatestBlock', async (params) => {
  const { kit } = params
  const latest = await kit.connection.web3.eth.getBlock('latest')
  return latest
})
