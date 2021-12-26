import { createSlice } from '@reduxjs/toolkit'
import { NativeTokenId } from 'src/config/tokens'
import { AccountBalances, fetchBalances } from 'src/features/accounts/fetchBalances'

interface AccountState {
  balances: AccountBalances
  lastUpdated: number | null
}

const initialState: AccountState = {
  balances: {
    [NativeTokenId.CELO]: '0',
    [NativeTokenId.cUSD]: '0',
    [NativeTokenId.cEUR]: '0',
    [NativeTokenId.cREAL]: '0',
  },
  lastUpdated: null,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
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
