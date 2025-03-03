import { useEffect, useMemo, useState } from 'react'
import { Celo } from 'src/config/chains'
import { TokenId, getSwappableTokenOptions, getTokenOptionsByChainId } from 'src/config/tokens'
import { logger } from 'src/utils/logger'
import { useNetwork } from 'wagmi'

export function useTokenOptions(fromTokenId: TokenId) {
  const { chain } = useNetwork()
  const chainId = useMemo(() => chain?.id ?? Celo.chainId, [chain])
  const [swappableTokens, setSwappableTokens] = useState<TokenId[]>([])

  // Get all available tokens for current chain
  const allTokenOptions = useMemo(() => {
    return getTokenOptionsByChainId(chainId)
  }, [chainId])

  // Get tokens that can be swapped with selected token
  useEffect(() => {
    const fetchSwappableTokens = async () => {
      const tokens = await getSwappableTokenOptions(fromTokenId, chainId)
      setSwappableTokens(tokens)
    }

    fetchSwappableTokens().catch(logger.error)
  }, [chainId, fromTokenId])

  return {
    allTokenOptions,
    swappableTokens,
  }
}
