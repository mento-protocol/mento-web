import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { config } from 'src/config/config'
import { accountReducer } from 'src/features/accounts/accountSlice'
import { blockReducer } from 'src/features/blocks/blockSlice'
import { tokenPriceReducer } from 'src/features/chart/tokenPriceSlice'
import { grandaReducer } from 'src/features/granda/grandaSlice'
import { swapReducer } from 'src/features/swap/swapSlice'

export function createStore() {
  return configureStore({
    reducer: {
      account: accountReducer,
      block: blockReducer,
      granda: grandaReducer,
      swap: swapReducer,
      tokenPrice: tokenPriceReducer,
    },
    devTools: config.debug,
  })
}

export const store = createStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
