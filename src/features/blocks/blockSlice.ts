import { createSlice } from '@reduxjs/toolkit'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'

import { BlockStub } from './types'

interface BlockState {
  latestBlock: BlockStub | null | undefined
}

const initialState: BlockState = {
  latestBlock: undefined,
}

export const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLatestBlock.fulfilled, (state, action) => {
      const block = action.payload
      if (!block) return
      state.latestBlock = block
    })
    builder.addCase(fetchLatestBlock.rejected, (state) => {
      state.latestBlock = null
    })
  },
})

export const { reset } = blockSlice.actions
export const blockReducer = blockSlice.reducer
