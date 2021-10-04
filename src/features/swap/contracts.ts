import type { ContractKit } from '@celo/contractkit'
import { StableToken } from '@celo/contractkit'
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
