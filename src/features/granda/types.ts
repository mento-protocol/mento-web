import { NativeTokenId } from 'src/config/tokens'

export enum GrandaSubpage {
  List = 'list',
  View = 'view',
  Form = 'form',
  Confirm = 'confirm',
}

export interface GrandaFormValues {
  fromTokenId: NativeTokenId
  toTokenId: NativeTokenId
  fromAmount: number | string
}

export enum GrandaProposalState {
  Proposed = 'Proposed',
  Approved = 'Approved',
  Executed = 'Executed',
  Cancelled = 'Cancelled',
}

export interface GrandaProposal {
  id: string
  state: GrandaProposalState
  exchanger: string
  stableToken: string
  sellAmount: string
  buyAmount: string
  sellCelo: boolean
  vetoPeriodSeconds: number
  approvalTimestamp: number
}
