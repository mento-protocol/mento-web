import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { accountReducer } from 'src/features/accounts/accountSlice'
import { blockReducer } from 'src/features/blocks/blockSlice'
import { tokenPriceReducer } from 'src/features/chart/tokenPriceSlice'
import { swapReducer } from 'src/features/swap/swapSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      account: accountReducer,
      swap: swapReducer,
      tokenPrice: tokenPriceReducer,
      block: blockReducer,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
