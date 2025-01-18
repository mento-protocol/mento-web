import { createSlice } from '@reduxjs/toolkit'
import { TokenId } from 'src/config/tokens'
import { AccountBalances, fetchBalances } from 'src/features/accounts/fetchBalances'

interface AccountState {
  balances: AccountBalances
  lastUpdated: number | null
  isFetchingBalance: boolean
}

const initialState: AccountState = {
  balances: Object.values(TokenId).reduce((result, id) => {
    result[id] = '0'
    return result
  }, {} as AccountBalances),
  lastUpdated: null,
  isFetchingBalance: true, // Initialize isFetchingBalance to true
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalances.fulfilled, (state, action) => {
        const balances = action.payload
        if (!balances) return
        state.balances = balances
        state.lastUpdated = Date.now()
        state.isFetchingBalance = false // Set isFetchingBalance to false when fetching is complete
      })
      .addCase(fetchBalances.rejected, (state) => {
        state.isFetchingBalance = false // Set isFetchingBalance to false if fetching fails
      })
  },
})

export const { reset } = accountSlice.actions
export const accountReducer = accountSlice.reducer
