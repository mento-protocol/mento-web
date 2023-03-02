import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SwapFormValues, ToCeloRates } from 'src/features/swap/types'

export interface SwapState {
  formValues: SwapFormValues | null
  toCeloRates: ToCeloRates
  showSlippage: boolean
  showChart: boolean
}

const initialState: SwapState = {
  formValues: null,
  toCeloRates: {},
  showSlippage: false,
  showChart: false,
}

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setFormValues: (state, action: PayloadAction<SwapFormValues | null>) => {
      state.formValues = action.payload
    },
    setShowSlippage: (state, action: PayloadAction<boolean>) => {
      state.showSlippage = action.payload
    },
    setShowChart: (state, action: PayloadAction<boolean>) => {
      state.showChart = action.payload
    },
    reset: () => initialState,
  },
})

export const { setFormValues, setShowSlippage, setShowChart, reset } = swapSlice.actions
export const swapReducer = swapSlice.reducer
