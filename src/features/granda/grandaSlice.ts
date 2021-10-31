import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import { fetchSizeLimits } from 'src/features/granda/fetchSizeLimits'
import {
  GrandaFormValues,
  GrandaProposal,
  GrandaSubpage,
  SizeLimits,
} from 'src/features/granda/types'

export interface GrandaState {
  isActive: boolean // tracks if granda page was loaded to lazily fetch granda info
  subpage: GrandaSubpage
  proposals: Record<string, GrandaProposal>
  proposalsLastUpdated: number | null
  viewProposalId: string | null // id of proposal for details view subpage
  formValues: GrandaFormValues | null
  sizeLimits: SizeLimits | null
}

const initialState: GrandaState = {
  isActive: false,
  subpage: GrandaSubpage.List,
  proposals: {},
  proposalsLastUpdated: null,
  viewProposalId: null,
  formValues: null,
  sizeLimits: null,
}

export const grandaSlice = createSlice({
  name: 'granda',
  initialState,
  reducers: {
    activateGranda: (state) => {
      state.isActive = true
    },
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
    setSizeLimits: (state, action: PayloadAction<SizeLimits>) => {
      state.sizeLimits = action.payload
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
    builder.addCase(fetchSizeLimits.fulfilled, (state, action) => {
      const limits = action.payload
      if (!limits) return
      state.sizeLimits = limits
    })
  },
})

export const {
  activateGranda,
  setFormValues,
  setSubpage,
  viewProposal,
  clearProposal,
  setSizeLimits,
  reset,
} = grandaSlice.actions
export const grandaReducer = grandaSlice.reducer
