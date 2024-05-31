import { TokenId } from 'src/config/tokens'

export enum ForeignQuoteCurrency {
  BTC = 'BTC',
  USD = 'USD',
}

export type QuoteCurrency = TokenId | ForeignQuoteCurrency

export interface TokenPricePoint {
  timestamp: number
  price: number
}
export type TokenPriceHistory = Array<TokenPricePoint>

export type QuoteCurrencyPriceHistory = Partial<Record<QuoteCurrency, TokenPriceHistory>>
export type BaseCurrencyPriceHistory = Partial<Record<TokenId, QuoteCurrencyPriceHistory>>

export interface PairPriceUpdate {
  baseCurrency: TokenId
  quoteCurrency: QuoteCurrency
  prices: TokenPriceHistory
}
