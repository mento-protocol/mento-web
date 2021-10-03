import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SwapFormValues, ToCeloRates } from 'src/features/swap/types'

export interface SwapState {
  formValues: SwapFormValues | null
  toCeloRates: ToCeloRates
}

const initialState: SwapState = {
  formValues: null,
  toCeloRates: {},
}

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFormValues: (state, action: PayloadAction<SwapFormValues | null>) => {
      state.formValues = action.payload
    },
    setExchangeRates: (state, action: PayloadAction<ToCeloRates>) => {
      state.toCeloRates = action.payload
    },
    reset: () => initialState,
  },
})

export const { setFormValues, setExchangeRates, reset } = swapSlice.actions
export const swapReducer = swapSlice.reducer
