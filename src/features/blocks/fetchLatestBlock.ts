import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/features/store/store'

import { getProvider } from '../providers'

import { BlockStub } from './types'

interface FetchLatestBlockParams {
  chainId: number
}

export const fetchLatestBlock = createAsyncThunk<
  BlockStub,
  FetchLatestBlockParams,
  { dispatch: AppDispatch; state: AppState }
>('blocks/fetchLatestBlock', async (params) => {
  const { chainId } = params
  const provider = getProvider(chainId)
  const latest = await provider.getBlock('latest')
  return {
    hash: latest.hash,
    parentHash: latest.parentHash,
    number: latest.number,
    timestamp: latest.timestamp,
    nonce: latest.nonce,
  }
})
