import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GrandaFormValues, GrandaSubpage } from 'src/features/granda/types'

export interface GrandaState {
  subpage: GrandaSubpage
  formValues: GrandaFormValues | null
  viewProposalId: string | null
}

const initialState: GrandaState = {
  subpage: GrandaSubpage.List,
  formValues: null,
  viewProposalId: null,
}

export const grandaSlice = createSlice({
  name: 'granda',
  initialState,
  reducers: {
    setSubpage: (state, action: PayloadAction<GrandaSubpage>) => {
      state.subpage = action.payload
    },
    setFormValues: (state, action: PayloadAction<GrandaFormValues | null>) => {
      state.formValues = action.payload
    },
    viewProposal: (state, action: PayloadAction<string>) => {
      state.viewProposalId = action.payload
      state.subpage = GrandaSubpage.View
    },
    clearProposal: (state) => {
      state.viewProposalId = null
      state.subpage = GrandaSubpage.List
    },
    reset: () => initialState,
  },
})

export const { setFormValues, setSubpage, viewProposal, clearProposal, reset } = grandaSlice.actions
export const grandaReducer = grandaSlice.reducer
