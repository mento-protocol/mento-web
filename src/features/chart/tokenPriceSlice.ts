import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStore } from 'next-persist'
import { BaseCurrencyPriceHistory, PairPriceUpdate } from 'src/features/chart/types'

interface TokenPrices {
  // Base currency to quote currency to price list
  prices: BaseCurrencyPriceHistory
}

const initialState: TokenPrices = {
  prices: {},
}

const persistedState = getLocalStore('tokenPrice', initialState)

const tokenPriceSlice = createSlice({
  name: 'tokenPrice',
  initialState: persistedState,
  reducers: {
    updatePairPrices: (state, action: PayloadAction<PairPriceUpdate[]>) => {
      for (const ppu of action.payload) {
        const { baseCurrency, quoteCurrency, prices } = ppu
        state.prices[baseCurrency] = {
          ...state.prices[baseCurrency],
          [quoteCurrency]: prices,
        }
      }
    },
    resetTokenPrices: () => initialState,
  },
})

export const { updatePairPrices, resetTokenPrices } = tokenPriceSlice.actions
export const tokenPriceReducer = tokenPriceSlice.reducer
