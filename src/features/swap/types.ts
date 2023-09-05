import { TokenId } from 'src/config/tokens'

export type SwapDirection = 'in' | 'out'

export interface SwapFormValues {
  fromTokenId: TokenId
  toTokenId: TokenId
  amount: number | string
  quote: number | string
  direction: SwapDirection
  slippage: string
  submitType: string
}

export type ToCeloRates = Partial<Record<TokenId, ExchangeRate>>

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

export type SizeLimits = Partial<Record<TokenId, { min: string; max: string }>>
