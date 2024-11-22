import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SwapFormValues, ToCeloRates } from 'src/features/swap/types'

export interface SwapState {
  formValues: SwapFormValues | null
  toCeloRates: ToCeloRates
  showSlippage: boolean
  showChart: boolean
  confirmView: boolean
}

const initialState: SwapState = {
  formValues: null,
  toCeloRates: {},
  showSlippage: false,
  showChart: false,
  confirmView: false,
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
    setConfirmView(state, action) {
      state.confirmView = action.payload
    },
  },
})

export const { setFormValues, setShowSlippage, setShowChart, reset, setConfirmView } =
  swapSlice.actions
export const swapReducer = swapSlice.reducer
