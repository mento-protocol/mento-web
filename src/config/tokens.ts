import { config } from 'src/config/config'
import { Color } from 'src/styles/Color'

export interface Token {
  id: string
  symbol: string // usually the same as id
  name: string
  color: string
  decimals: number
  chainId: number
}

export interface TokenWithBalance extends Token {
  value: string
}

export enum NativeTokenId {
  CELO = 'CELO',
  cUSD = 'cUSD',
  cEUR = 'cEUR',
  cREAL = 'cREAL',
}

export const StableTokenIds = [NativeTokenId.cUSD, NativeTokenId.cEUR, NativeTokenId.cREAL]

export interface INativeTokens {
  CELO: Token
  cUSD: Token
  cEUR: Token
  cREAL: Token
}

export const NativeTokens: INativeTokens = {
  CELO: {
    id: NativeTokenId.CELO,
    symbol: NativeTokenId.CELO,
    name: 'Celo Native',
    color: Color.celoGold,
    decimals: 18,
    chainId: config.chainId,
  },
  cUSD: {
    id: NativeTokenId.cUSD,
    symbol: NativeTokenId.cUSD,
    name: 'Celo Dollar',
    color: Color.celoGreen,
    decimals: 18,
    chainId: config.chainId,
  },
  cEUR: {
    id: NativeTokenId.cEUR,
    symbol: NativeTokenId.cEUR,
    name: 'Celo Euro',
    color: Color.celoGreen,
    decimals: 18,
    chainId: config.chainId,
  },
  cREAL: {
    id: NativeTokenId.cREAL,
    symbol: NativeTokenId.cREAL,
    name: 'Celo Real',
    color: Color.celoGreen,
    decimals: 18,
    chainId: config.chainId,
  },
}

export type Tokens = INativeTokens & Record<string, Token>

// Just re-export directly for convenient access
export const CELO = NativeTokens.CELO
export const cUSD = NativeTokens.cUSD
export const cEUR = NativeTokens.cEUR
export const cREAL = NativeTokens.cREAL

export function isNativeToken(tokenId: string) {
  return Object.keys(NativeTokens).includes(tokenId)
}

export function isStableToken(tokenId: string) {
  return StableTokenIds.includes(tokenId as NativeTokenId)
}

export function getTokenById(id: string, tokens: Tokens) {
  if (tokens[id]) return tokens[id]
  else return null
}
