import { NativeTokenId } from 'src/config/tokens'
import { SimpleExchangeRate } from 'src/features/swap/types'

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

export type OracleRates = Partial<Record<NativeTokenId, SimpleExchangeRate>>

export interface GrandaConfig {
  approver: string
  spread: number
  vetoPeriodSeconds: number
  maxApprovalExchangeRateChange: number
  exchangeLimits: SizeLimits
}

export type SizeLimits = Partial<Record<NativeTokenId, { min: string; max: string }>>
