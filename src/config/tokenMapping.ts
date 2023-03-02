/**
 * Utilities for converting between kit and local token contracts/models
 * The kit is a bit of a mess so this DApp uses it's own enums/types
 */
import { CeloContract, CeloTokenType, StableToken, Token } from '@celo/contractkit'
import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import { TokenId } from 'src/config/tokens'

export async function getExchangeContract(kit: MiniContractKit, tokenId: TokenId) {
  switch (tokenId) {
    case TokenId.cUSD:
      return kit.contracts.getExchange(StableToken.cUSD)
    case TokenId.cEUR:
      return kit.contracts.getExchange(StableToken.cEUR)
    case TokenId.cREAL:
      return kit.contracts.getExchange(StableToken.cREAL)
    default:
      throw new Error(`Could not get contract for token ${tokenId}`)
  }
}

export async function getTokenContract(kit: MiniContractKit, tokenId: TokenId) {
  switch (tokenId) {
    case TokenId.cUSD:
      return kit.contracts.getStableToken(StableToken.cUSD)
    case TokenId.cEUR:
      return kit.contracts.getStableToken(StableToken.cEUR)
    case TokenId.cREAL:
      return kit.contracts.getStableToken(StableToken.cREAL)
    case TokenId.CELO:
      return kit.contracts.getGoldToken()
    default:
      throw new Error(`Could not get contract for token ${tokenId}`)
  }
}

export function kitContractToNativeToken(name: CeloContract): TokenId {
  if (name === CeloContract.StableToken) return TokenId.cUSD
  if (name === CeloContract.StableTokenEUR) return TokenId.cEUR
  if (name === CeloContract.StableTokenBRL) return TokenId.cREAL
  if (name === CeloContract.GoldToken) return TokenId.CELO
  throw new Error(`Unsupported token contract name ${name}`)
}

export function kitTokenToNativeToken(tokenId: CeloTokenType): TokenId {
  switch (tokenId) {
    case StableToken.cUSD:
      return TokenId.cUSD
    case StableToken.cEUR:
      return TokenId.cEUR
    case StableToken.cREAL:
      return TokenId.cREAL
    case Token.CELO:
      return TokenId.CELO
    default:
      throw new Error(`Unsupported token id ${tokenId}`)
  }
}

export function nativeTokenToKitToken(tokenId: TokenId): CeloTokenType {
  switch (tokenId) {
    case TokenId.cUSD:
      return StableToken.cUSD
    case TokenId.cEUR:
      return StableToken.cEUR
    case TokenId.cREAL:
      return StableToken.cREAL
    case TokenId.CELO:
      return Token.CELO
    default:
      throw new Error(`Unsupported token id ${tokenId}`)
  }
}
