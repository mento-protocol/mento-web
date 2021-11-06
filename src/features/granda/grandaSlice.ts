import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchConfig } from 'src/features/granda/fetchConfig'
import { fetchProposals } from 'src/features/granda/fetchProposals'
import {
  GrandaConfig,
  GrandaFormValues,
  GrandaProposal,
  GrandaSubpage,
} from 'src/features/granda/types'

export interface GrandaState {
  isActive: boolean // tracks if granda page was loaded to lazily fetch granda info
  subpage: GrandaSubpage
  proposals: Record<string, GrandaProposal>
  proposalsLastUpdated: number | null
  viewProposalId: string | null // id of proposal for details view subpage
  formValues: GrandaFormValues | null
  config: GrandaConfig | null
}

const initialState: GrandaState = {
  isActive: false,
  subpage: GrandaSubpage.Form,
  proposals: {},
  proposalsLastUpdated: null,
  viewProposalId: null,
  formValues: null,
  config: null,
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
      const values = action.payload
      if (values) {
        state.subpage = GrandaSubpage.Confirm
        state.formValues = values
      } else {
        state.subpage = GrandaSubpage.Form
        state.formValues = null
      }
    },
    viewProposal: (state, action: PayloadAction<string>) => {
      state.viewProposalId = action.payload
      state.subpage = GrandaSubpage.View
    },
    clearProposal: (state) => {
      state.viewProposalId = null
      state.subpage = GrandaSubpage.List
    },
    setConfig: (state, action: PayloadAction<GrandaConfig>) => {
      state.config = action.payload
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
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      const config = action.payload
      if (!config) return
      state.config = config
    })
  },
})

export const {
  activateGranda,
  setFormValues,
  setSubpage,
  viewProposal,
  clearProposal,
  setConfig: setSizeLimits,
  reset,
} = grandaSlice.actions
export const grandaReducer = grandaSlice.reducer
