import { NativeTokenId } from 'src/config/tokens'

export interface SwapFormValues {
  fromTokenId: NativeTokenId
  toTokenId: NativeTokenId
  fromAmount: number | string
  slippage: string
}

export type ToCeloRates = Record<string, ExchangeRate> // token id to token<->CELO rate

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
