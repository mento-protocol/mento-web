import { useQuery } from '@tanstack/react-query'
import { Contract } from 'ethers'
import { ERC20_ABI } from 'src/config/consts'
import { BrokerAddresses } from 'src/config/exchanges'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import { logger } from 'src/utils/logger'

async function fetchAllowance(
  tokenAddr: string,
  accountAddress: string,
  chainId: number
): Promise<string> {
  logger.info(`Fetching allowance for token ${tokenAddr} on chain ${chainId}`)
  const provider = getProvider(chainId)
  const contract = new Contract(tokenAddr, ERC20_ABI, provider)
  const brokerAddress = BrokerAddresses[chainId as keyof typeof BrokerAddresses]

  const allowance = await contract.allowance(accountAddress, brokerAddress)
  logger.info(`Allowance: ${allowance.toString()}`)
  return allowance.toString()
}

export function useAllowance(chainId: number, tokenId: TokenId, accountAddress?: string) {
  const { data: allowance, isLoading } = useQuery(
    ['tokenAllowance', chainId, tokenId, accountAddress],
    async () => {
      if (!accountAddress) return '0'
      const tokenAddr = getTokenAddress(tokenId, chainId)
      return fetchAllowance(tokenAddr, accountAddress, chainId)
    },
    {
      retry: false,
      enabled: Boolean(accountAddress && chainId && tokenId),
      staleTime: 5000, // Consider allowance stale after 5 seconds
    }
  )

  return {
    allowance: allowance || '0',
    isLoading,
  }
}
