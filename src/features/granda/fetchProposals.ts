import type { ContractKit } from '@celo/contractkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, AppState } from 'src/app/store'
import { GRANDA_PROPOSAL_STALE_TIME } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import { GrandaProposal } from 'src/features/granda/types'
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
  console.log('===fetching proposals')
  const contract = await kit.contracts.getGrandaMento()
  const propCount = await contract.exchangeProposalCount()
  console.log('propCount', propCount.toNumber())
  const prop0 = await contract.getExchangeProposal(0)
  console.log(prop0)
  const propn = await contract.getExchangeProposal(propCount.toNumber() - 1)
  console.log(propn)
  const propn1 = await contract.getExchangeProposal(propCount.toNumber())
  console.log(propn1)
  // @ts-ignore
  // const proposals = await rawContract.methods.exchangeProposals()
  // console.log('props', proposals)
  // const proposal0 = await rawContract.methods.exchangeProposals(0)
  // console.log('prop0', proposal0)
  return {}
}
