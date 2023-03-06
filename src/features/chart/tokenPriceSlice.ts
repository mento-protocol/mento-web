import { createSlice } from '@reduxjs/toolkit'
// import { fetchTokenPrice } from 'src/features/chart/fetchPrices'
import { BaseCurrencyPriceHistory } from 'src/features/chart/types'

interface TokenPrices {
  // Base currency to quote currency to price list
  prices: BaseCurrencyPriceHistory
}

const initialState: TokenPrices = {
  prices: {},
}

const tokenPriceSlice = createSlice({
  name: 'tokenPrice',
  initialState,
  reducers: {
    resetTokenPrices: () => initialState,
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchTokenPrice.fulfilled, (state, action) => {
  //     const rates = action.payload
  //     if (!rates) return
  //     for (const ppu of rates) {
  //       const { baseCurrency, quoteCurrency, prices } = ppu
  //       state.prices[baseCurrency] = {
  //         ...state.prices[baseCurrency],
  //         [quoteCurrency]: prices,
  //       }
  //     }
  //   })
  // },
})

export const { resetTokenPrices } = tokenPriceSlice.actions
export const tokenPriceReducer = tokenPriceSlice.reducer
