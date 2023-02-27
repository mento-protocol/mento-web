import { NativeTokenId } from 'src/config/tokens'

export interface SwapFormValues {
  fromTokenId: NativeTokenId
  toTokenId: NativeTokenId
  fromAmount: number | string
  slippage: string
}

export type ToCeloRates = Partial<Record<NativeTokenId, ExchangeRate>>

// Raw Mento chain data from an Exchange contract
export interface ExchangeRate {
  stableBucket: string
  celoBucket: string
  spread: string
  lastUpdated: number
}

// Result after ExchangeRate gets processed
export interface SimpleExchangeRate {
  rate: number
  lastUpdated: number
}

export type SizeLimits = Partial<Record<NativeTokenId, { min: string; max: string }>>
