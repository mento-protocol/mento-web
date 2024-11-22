import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { SWAP_QUOTE_REFETCH_INTERVAL } from 'src/config/consts'
import { TokenId, Tokens, getTokenAddress } from 'src/config/tokens'
import { getMentoSdk } from 'src/features/sdk'
import { SwapDirection } from 'src/features/swap/types'
import {
  calcExchangeRate,
  invertExchangeRate,
  parseInputExchangeAmount,
} from 'src/features/swap/utils'
import { fromWei } from 'src/utils/amount'
import { useDebounce } from 'src/utils/debounce'
import { logger } from 'src/utils/logger'
import { useChainId } from 'wagmi'

export function useSwapQuote(
  amount: string | number,
  direction: SwapDirection,
  fromTokenId: TokenId,
  toTokenId: TokenId
) {
  const chainId = useChainId()

  const debouncedAmount = useDebounce(amount, 0)

  const { isLoading, isError, error, data, refetch } = useQuery(
    ['useSwapQuote', debouncedAmount, fromTokenId, toTokenId, direction],
    async () => {
      const fromToken = Tokens[fromTokenId]
      const toToken = Tokens[toTokenId]
      const isSwapIn = direction === 'in'
      const amountWei = parseInputExchangeAmount(amount, isSwapIn ? fromTokenId : toTokenId)
      const amountWeiBN = ethers.BigNumber.from(amountWei)
      const amountDecimals = isSwapIn ? fromToken.decimals : toToken.decimals
      const quoteDecimals = isSwapIn ? toToken.decimals : fromToken.decimals
      if (amountWeiBN.lte(0) || !fromToken || !toToken) return null
      const fromTokenAddr = getTokenAddress(fromTokenId, chainId)
      const toTokenAddr = getTokenAddress(toTokenId, chainId)
      const mento = await getMentoSdk(chainId)

      let quoteWei: string
      if (isSwapIn) {
        quoteWei = (await mento.getAmountOut(fromTokenAddr, toTokenAddr, amountWeiBN)).toString()
      } else {
        quoteWei = (await mento.getAmountIn(fromTokenAddr, toTokenAddr, amountWeiBN)).toString()
      }

      const quote = fromWei(quoteWei, quoteDecimals)
      const rateIn = calcExchangeRate(amountWei, amountDecimals, quoteWei, quoteDecimals)
      const rate = isSwapIn ? rateIn : invertExchangeRate(rateIn)

      return {
        amountWei,
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
    amountWei: data?.amountWei || '0',
    quoteWei: data?.quoteWei || '0',
    quote: data?.quote || '0',
    rate: data?.rate,
    refetch,
  }
}
