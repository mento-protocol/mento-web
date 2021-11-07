import type { ContractKit } from '@celo/contractkit'
import { CeloContract, CeloTokenType, StableToken, Token } from '@celo/contractkit'
import { NativeTokenId } from 'src/config/tokens'

export async function getExchangeContract(kit: ContractKit, tokenId: NativeTokenId) {
  switch (tokenId) {
    case NativeTokenId.cUSD:
      return kit.contracts.getExchange(StableToken.cUSD)
    case NativeTokenId.cEUR:
      return kit.contracts.getExchange(StableToken.cEUR)
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
    case NativeTokenId.CELO:
      return kit.contracts.getGoldToken()
    default:
      throw new Error(`Could not get contract for token ${tokenId}`)
  }
}

export function getNativeTokenId(name: CeloContract): NativeTokenId {
  if (name === CeloContract.StableToken) return NativeTokenId.cUSD
  if (name === CeloContract.StableTokenEUR) return NativeTokenId.cEUR
  if (name === CeloContract.GoldToken) return NativeTokenId.CELO
  throw new Error(`Unsupported token contract name ${name}`)
}

export function getContractKitToken(tokenId: NativeTokenId): CeloTokenType {
  switch (tokenId) {
    case NativeTokenId.cUSD:
      return StableToken.cUSD
    case NativeTokenId.cEUR:
      return StableToken.cEUR
    case NativeTokenId.CELO:
      return Token.CELO
    default:
      throw new Error(`Unsupported token id ${tokenId}`)
  }
}
