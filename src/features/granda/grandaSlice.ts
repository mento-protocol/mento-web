import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import { GrandaFormValues, GrandaProposal, GrandaSubpage } from 'src/features/granda/types'

export interface GrandaState {
  subpage: GrandaSubpage
  proposals: Record<string, GrandaProposal>
  proposalsLastUpdated: number | null
  viewProposalId: string | null
  formValues: GrandaFormValues | null
}

const initialState: GrandaState = {
  subpage: GrandaSubpage.List,
  proposals: {},
  proposalsLastUpdated: null,
  viewProposalId: null,
  formValues: null,
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
  extraReducers: (builder) => {
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      const proposals = action.payload
      if (!proposals) return
      state.proposals = proposals
      state.proposalsLastUpdated = Date.now()
    })
  },
})

export const { setFormValues, setSubpage, viewProposal, clearProposal, reset } = grandaSlice.actions
export const grandaReducer = grandaSlice.reducer
