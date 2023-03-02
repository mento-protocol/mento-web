import { ChainId } from '@celo/react-celo'
import { providers } from 'ethers'
import { chainIdToChain } from 'src/config/chains'

const cache: Record<number, providers.JsonRpcProvider> = {}

export function getProvider(chainId: ChainId) {
  if (cache[chainId]) return cache[chainId]
  const chain = chainIdToChain[chainId]
  const provider = new providers.JsonRpcProvider(chain.rpcUrl, chainId)
  cache[chainId] = provider
  return provider
}
