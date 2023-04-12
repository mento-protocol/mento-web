import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { SWAP_QUOTE_REFETCH_INTERVAL } from 'src/config/consts'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { NumberT, fromWeiRounded } from 'src/utils/amount'
import { useDebounce } from 'src/utils/debounce'
import { logger } from 'src/utils/logger'
import { useChainId } from 'wagmi'

import { getMentoSdk } from '../sdk'

export function useSwapOutQuote(fromAmountWei: string, fromTokenId: TokenId, toTokenId: TokenId) {
  const chainId = useChainId()

  const debouncedFromAmountWei = useDebounce(fromAmountWei, 350)

  const { isLoading, isError, error, data } = useQuery(
    ['useSwapOutQuote', debouncedFromAmountWei, fromTokenId, toTokenId],
    async () => {
      const fromAmountBN = ethers.BigNumber.from(debouncedFromAmountWei)
      if (fromAmountBN.lte(0) || !fromTokenId || !toTokenId) return null
      const mento = await getMentoSdk(chainId)
      const fromTokenAddr = getTokenAddress(fromTokenId, chainId)
      const toTokenAddr = getTokenAddress(toTokenId, chainId)
      const toAmountWei = (
        await mento.getAmountOut(fromTokenAddr, toTokenAddr, fromAmountBN)
      ).toString()
      return {
        toAmountWei: toAmountWei,
        toAmount: fromWeiRounded(toAmountWei),
        rate: calcExchangeRate(debouncedFromAmountWei, toAmountWei),
      }
    },
    {
      staleTime: SWAP_QUOTE_REFETCH_INTERVAL,
      refetchInterval: SWAP_QUOTE_REFETCH_INTERVAL,
    }
  )

  useEffect(() => {
    if (error) {
      toast.error('Unable to fetch swap out amount')
      logger.error(error)
    }
  }, [error])

  return {
    isLoading,
    isError,
    toAmountWei: data?.toAmountWei || '0',
    toAmount: data?.toAmount || '0',
    rate: data?.rate,
  }
}

function calcExchangeRate(fromAmount: NumberT, toAmount: NumberT) {
  try {
    return new BigNumber(fromAmount).dividedBy(toAmount).toFixed(2, BigNumber.ROUND_DOWN)
  } catch (error) {
    logger.warn('Error computing exchange values', error)
    return '0'
  }
}
