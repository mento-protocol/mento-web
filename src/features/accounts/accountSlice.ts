import { createSlice } from '@reduxjs/toolkit'
import { NativeTokenId } from 'src/config/tokens'
import { AccountBalances, fetchBalances } from 'src/features/accounts/fetchBalances'

interface SwapState {
  balances: AccountBalances
  lastUpdated: number | null
}

const initialState: SwapState = {
  balances: {
    [NativeTokenId.CELO]: '0',
    [NativeTokenId.cUSD]: '0',
    [NativeTokenId.cEUR]: '0',
  },
  lastUpdated: null,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBalances.fulfilled, (state, action) => {
      const balances = action.payload
      if (!balances) return
      state.balances = balances
      state.lastUpdated = Date.now()
    })
  },
})

export const { reset } = accountSlice.actions
export const accountReducer = accountSlice.reducer
