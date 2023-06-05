import { NumberT, fromWeiRounded } from 'src/utils/amount'
import { TokenId, Tokens, getTokenAddress } from 'src/config/tokens'

import BigNumber from 'bignumber.js'
import { SWAP_QUOTE_REFETCH_INTERVAL } from 'src/config/consts'
import { ethers } from 'ethers'
import { getMentoSdk } from '../sdk'
import { logger } from 'src/utils/logger'
import { toast } from 'react-toastify'
import { useChainId } from 'wagmi'
import { useDebounce } from 'src/utils/debounce'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export function useSwapOutQuote(
  fromAmount: string | number,
  fromAmountWei: string,
  fromTokenId: TokenId,
  toTokenId: TokenId
) {
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
      const toAmount = fromWeiRounded(toAmountWei, Tokens[toTokenId].decimals)
      return {
        toAmountWei,
        toAmount,
        rate: calcExchangeRate(fromAmount, toAmount),
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

// TODO properly account for token decimal values
function calcExchangeRate(fromAmount: NumberT, toAmount: NumberT) {
  try {
    return new BigNumber(fromAmount).dividedBy(toAmount).toFixed(4, BigNumber.ROUND_DOWN)
  } catch (error) {
    logger.warn('Error computing exchange values', error)
    return '0'
  }
}
