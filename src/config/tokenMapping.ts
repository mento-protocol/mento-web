/**
 * Utilities for converting between kit and local token contracts/models
 * The kit is a bit of a mess so this DApp uses it's own enums/types
 */

import type { ContractKit } from '@celo/contractkit'
import { CeloContract, CeloTokenType, StableToken, Token } from '@celo/contractkit'
import { NativeTokenId } from 'src/config/tokens'

export async function getExchangeContract(kit: ContractKit, tokenId: NativeTokenId) {
  switch (tokenId) {
    case NativeTokenId.cUSD:
      return kit.contracts.getExchange(StableToken.cUSD)
    case NativeTokenId.cEUR:
      return kit.contracts.getExchange(StableToken.cEUR)
    case NativeTokenId.cREAL:
      return kit.contracts.getExchange(StableToken.cREAL)
    default:
      throw new Error(`Could not get contract for token ${tokenId}`)
  }
}

export async function getTokenContract(kit: ContractKit, tokenId: NativeTokenId) {
  switch (tokenId) {
    case NativeTokenId.cUSD:
      return kit.contracts.getStableToken(StableToken.cUSD)
    case NativeTokenId.cEUR:
      return kit.contracts.getStableToken(StableToken.cEUR)
    case NativeTokenId.cREAL:
      return kit.contracts.getStableToken(StableToken.cREAL)
    case NativeTokenId.CELO:
      return kit.contracts.getGoldToken()
    default:
      throw new Error(`Could not get contract for token ${tokenId}`)
  }
}

export function kitContractToNativeToken(name: CeloContract): NativeTokenId {
  if (name === CeloContract.StableToken) return NativeTokenId.cUSD
  if (name === CeloContract.StableTokenEUR) return NativeTokenId.cEUR
  if (name === CeloContract.StableTokenBRL) return NativeTokenId.cREAL
  if (name === CeloContract.GoldToken) return NativeTokenId.CELO
  throw new Error(`Unsupported token contract name ${name}`)
}

export function kitTokenToNativeToken(tokenId: CeloTokenType): NativeTokenId {
  switch (tokenId) {
    case StableToken.cUSD:
      return NativeTokenId.cUSD
    case StableToken.cEUR:
      return NativeTokenId.cEUR
    case StableToken.cREAL:
      return NativeTokenId.cREAL
    case Token.CELO:
      return NativeTokenId.CELO
    default:
      throw new Error(`Unsupported token id ${tokenId}`)
  }
}

export function nativeTokenToKitToken(tokenId: NativeTokenId): CeloTokenType {
  switch (tokenId) {
    case NativeTokenId.cUSD:
      return StableToken.cUSD
    case NativeTokenId.cEUR:
      return StableToken.cEUR
    case NativeTokenId.cREAL:
      return StableToken.cREAL
    case NativeTokenId.CELO:
      return Token.CELO
    default:
      throw new Error(`Unsupported token id ${tokenId}`)
  }
}
