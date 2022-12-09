import type { CeloTokenType } from '@celo/contractkit'
import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { ExchangeProposalState } from '@celo/contractkit/lib/wrappers/GrandaMento'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { GRANDA_PROPOSAL_STALE_TIME } from 'src/config/consts'
import { kitTokenToNativeToken } from 'src/config/tokenMapping'
import { NativeTokenId, isStableToken } from 'src/config/tokens'
import { getGrandaMento } from 'src/contract-wrappers/granda-mento'
import { GrandaProposal, GrandaProposalState } from 'src/features/granda/types'
import { areAddressesEqual, isValidAddress } from 'src/utils/addresses'
import { logger } from 'src/utils/logger'
import { isStale } from 'src/utils/time'

interface FetchProposalsParams {
  kit: MiniContractKit
  force?: boolean
}

export const fetchProposals = createAsyncThunk<
  Record<string, GrandaProposal> | null,
  FetchProposalsParams,
  { dispatch: AppDispatch; state: AppState }
>('granda/fetchProposals', async (params, thunkAPI) => {
  const { kit, force } = params
  const proposalsLastUpdated = thunkAPI.getState().granda.proposalsLastUpdated
  if (isStale(proposalsLastUpdated, GRANDA_PROPOSAL_STALE_TIME) || force) {
    logger.debug('Fetching granda proposals')
    return _fetchProposals(kit)
  } else {
    return null
  }
})

async function _fetchProposals(kit: MiniContractKit): Promise<Record<string, GrandaProposal>> {
  const contract = await getGrandaMento(kit)
  const propCountBN = await contract.exchangeProposalCount()
  const propCount = propCountBN.toNumber()
  const proposals: Record<string, GrandaProposal> = {}
  if (propCount <= 0) return proposals

  // Get token addresses to map addr in proposal to token id
  const tokenToAddr = await kit.celoTokens.getAddresses()

  // Validate and transform the proposal data to local models
  for (let i = 1; i <= propCount; i++) {
    const proposal = await contract.getExchangeProposal(i)
    const id = proposal.id.toString()
    const {
      state,
      exchanger,
      stableToken: stableTokenAddr,
      sellAmount,
      buyAmount,
      sellCelo,
      vetoPeriodSeconds,
      approvalTimestamp,
    } = proposal
    if (!isValidAddress(exchanger)) throw new Error(`Invalid proposal exchanger ${exchanger}`)
    if (!isValidAddress(stableTokenAddr))
      throw new Error(`Invalid proposal stableToken ${stableTokenAddr}`)
    if (!sellAmount || sellAmount.lte(0)) throw new Error(`Invalid sell amount ${sellAmount}`)
    if (!buyAmount || buyAmount.lte(0)) throw new Error(`Invalid buy amount ${buyAmount}`)
    if (!vetoPeriodSeconds || vetoPeriodSeconds.lte(0))
      throw new Error(`Invalid veto period ${vetoPeriodSeconds}`)
    if (!approvalTimestamp || approvalTimestamp.lt(0))
      throw new Error(`Invalid approval time ${approvalTimestamp}`)

    const tokenId = findNativeTokenId(stableTokenAddr, tokenToAddr)
    if (!isStableToken(tokenId)) throw new Error('Token is not known stabletoken')

    proposals[id] = {
      id,
      state: toGrandaProposalState(state),
      exchanger,
      stableTokenId: tokenId,
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

function findNativeTokenId(
  stableTokenAddr: string,
  tokenToAddr: {
    [key in CeloTokenType]?: string
  }
): NativeTokenId {
  for (const _token of Object.keys(tokenToAddr)) {
    const token = _token as CeloTokenType
    const addr = tokenToAddr[token]
    if (addr && areAddressesEqual(stableTokenAddr, addr)) {
      return kitTokenToNativeToken(token)
    }
  }
  throw new Error(`No token found for addr ${stableTokenAddr}`)
}
