import { providers } from 'ethers'
import { ChainId, chainIdToChain } from 'src/config/chains'

const cache: Record<number, providers.JsonRpcProvider> = {}

// TODO remove and replace with useProvider from wagmi
export function getProvider(chainId: ChainId): providers.JsonRpcProvider {
  if (cache[chainId]) return cache[chainId]
  const chain = chainIdToChain[chainId]
  const provider = new providers.JsonRpcProvider(chain.rpcUrl, chainId)
  cache[chainId] = provider
  return provider
}
