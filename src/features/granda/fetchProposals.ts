import type { ContractKit } from '@celo/contractkit'
import { ExchangeProposalState } from '@celo/contractkit/lib/wrappers/GrandaMento'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { GRANDA_PROPOSAL_STALE_TIME } from 'src/config/consts'
import { GrandaProposal, GrandaProposalState } from 'src/features/granda/types'
import { isValidAddress } from 'src/utils/addresses'
import { logger } from 'src/utils/logger'
import { isStale } from 'src/utils/time'

interface FetchProposalsParams {
  kit: ContractKit
}

export const fetchProposals = createAsyncThunk<
  Record<string, GrandaProposal> | null,
  FetchProposalsParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchProposals', async (params, thunkAPI) => {
  const { kit } = params
  const proposalsLastUpdated = thunkAPI.getState().granda.proposalsLastUpdated
  if (isStale(proposalsLastUpdated, GRANDA_PROPOSAL_STALE_TIME)) {
    logger.debug('Fetching granda proposals')
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
  for (let i = 1; i <= propCount; i++) {
    const proposal = await contract.getExchangeProposal(i)
    const id = proposal.id.toString()
    const {
      state,
      exchanger,
      stableToken,
      sellAmount,
      buyAmount,
      sellCelo,
      vetoPeriodSeconds,
      approvalTimestamp,
    } = proposal
    if (!isValidAddress(exchanger)) throw new Error(`Invalid proposal exchanger ${exchanger}`)
    if (!isValidAddress(stableToken)) throw new Error(`Invalid proposal stableToken ${stableToken}`)
    if (!sellAmount || sellAmount.lte(0)) throw new Error(`Invalid sell amount ${sellAmount}`)
    if (!buyAmount || buyAmount.lte(0)) throw new Error(`Invalid buy amount ${buyAmount}`)
    if (!vetoPeriodSeconds || vetoPeriodSeconds.lte(0))
      throw new Error(`Invalid veto period ${vetoPeriodSeconds}`)
    if (!approvalTimestamp || approvalTimestamp.lte(0))
      throw new Error(`Invalid approval time ${approvalTimestamp}`)
    proposals[id] = {
      id,
      state: toGrandaProposalState(state),
      exchanger,
      stableToken,
      sellAmount: sellAmount.toFixed(0),
      buyAmount: buyAmount.toFixed(0),
      sellCelo,
      vetoPeriodSeconds: vetoPeriodSeconds.toNumber(),
      approvalTimestamp: approvalTimestamp.toNumber(),
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
