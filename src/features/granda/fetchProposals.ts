import type { ContractKit } from '@celo/contractkit'
import { ExchangeProposalState } from '@celo/contractkit/lib/wrappers/GrandaMento'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { GRANDA_PROPOSAL_STALE_TIME } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import { GrandaProposal, GrandaProposalState } from 'src/features/granda/types'
import { isStale } from 'src/utils/time'

interface FetchProposalsParams {
  kit: ContractKit
}

export type AccountBalances = Record<NativeTokenId, string>

export const fetchProposals = createAsyncThunk<
  Record<string, GrandaProposal> | null,
  FetchProposalsParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchProposals', async (params, thunkAPI) => {
  const { kit } = params
  const { proposalsLastUpdated } = thunkAPI.getState().granda
  if (isStale(proposalsLastUpdated, GRANDA_PROPOSAL_STALE_TIME)) {
    return _fetchProposals(kit)
  } else {
    return null
  }
})

async function _fetchProposals(kit: ContractKit): Promise<Record<string, GrandaProposal>> {
  const contract = await kit.contracts.getGrandaMento()
  const propCountBN = await contract.exchangeProposalCount()
  const propCount = propCountBN.toNumber()
  const proposals: Record<string, GrandaProposal> = {}
  for (let i = 0; i < propCount; i++) {
    const proposal = await contract.getExchangeProposal(i)
    const id = proposal.id.toString()
    // TODO validate proposal
    proposals[id] = {
      id,
      state: toGrandaProposalState(proposal.state),
      exchanger: proposal.exchanger,
      stableToken: proposal.stableToken,
      sellAmount: proposal.sellAmount.toString(),
      buyAmount: proposal.buyAmount.toString(),
      sellCelo: proposal.sellCelo,
      vetoPeriodSeconds: proposal.vetoPeriodSeconds.toNumber(),
      approvalTimestamp: proposal.approvalTimestamp.toNumber(),
    }
  }
  return proposals
}

function toGrandaProposalState(state: ExchangeProposalState) {
  switch (state) {
    case ExchangeProposalState.Proposed:
      return GrandaProposalState.Proposed
    case ExchangeProposalState.Approved:
      return GrandaProposalState.Approved
    case ExchangeProposalState.Executed:
      return GrandaProposalState.Executed
    case ExchangeProposalState.Cancelled:
      return GrandaProposalState.Cancelled
    default:
      throw new Error(`Invalid proposal state: ${state}`)
  }
}
