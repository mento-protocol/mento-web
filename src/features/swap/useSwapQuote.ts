import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { SWAP_QUOTE_REFETCH_INTERVAL } from 'src/config/consts'
import { TokenId, Tokens, getTokenAddress } from 'src/config/tokens'
import { getMentoSdk } from 'src/features/sdk'
import { SwapDirection } from 'src/features/swap/types'
import { calcExchangeRate, invertExchangeRate } from 'src/features/swap/utils'
import { fromWeiRounded } from 'src/utils/amount'
import { useDebounce } from 'src/utils/debounce'
import { logger } from 'src/utils/logger'
import { useChainId } from 'wagmi'

export function useSwapQuote(
  amountWei: string,
  direction: SwapDirection,
  fromTokenId: TokenId,
  toTokenId: TokenId
) {
  const chainId = useChainId()

  const debouncedAmountWei = useDebounce(amountWei, 350)

  const { isLoading, isError, error, data, refetch } = useQuery(
    ['useSwapQuote', debouncedAmountWei, fromTokenId, toTokenId, direction],
    async () => {
      const isSwapIn = direction === 'in'
      const amountBN = ethers.BigNumber.from(debouncedAmountWei)
      const fromToken = Tokens[fromTokenId]
      const toToken = Tokens[toTokenId]
      if (amountBN.lte(0) || !fromToken || !toToken) return null

      const fromTokenAddr = getTokenAddress(fromTokenId, chainId)
      const toTokenAddr = getTokenAddress(toTokenId, chainId)
      const mento = await getMentoSdk(chainId)

      let quoteWei: string
      if (isSwapIn) {
        quoteWei = (await mento.getAmountOut(fromTokenAddr, toTokenAddr, amountBN)).toString()
      } else {
        quoteWei = (await mento.getAmountIn(fromTokenAddr, toTokenAddr, amountBN)).toString()
      }

      const amountDecimals = isSwapIn ? fromToken.decimals : toToken.decimals
      const quoteDecimals = isSwapIn ? toToken.decimals : fromToken.decimals
      const quote = fromWeiRounded(quoteWei, quoteDecimals)
      const rateIn = calcExchangeRate(amountWei, amountDecimals, quoteWei, quoteDecimals)
      const rate = isSwapIn ? rateIn : invertExchangeRate(rateIn)

      return {
        quoteWei,
        quote,
        rate,
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
    quoteWei: data?.quoteWei || '0',
    quote: data?.quote || '0',
    rate: data?.rate,
    refetch,
  }
}
