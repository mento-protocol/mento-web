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

  const { isLoading, isError, error, data, refetch } = useQuery<ISwapData | null, ISwapError>(
    ['useSwapQuote', debouncedAmount, fromTokenId, toTokenId, direction],
    async (): Promise<ISwapData | null> => {
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

      const quoteWei = isSwapIn
        ? (await mento.getAmountOut(fromTokenAddr, toTokenAddr, amountWeiBN)).toString()
        : (await mento.getAmountIn(fromTokenAddr, toTokenAddr, amountWeiBN)).toString()

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
      toast.error(getToastErrorMessage(error?.message))
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

function getToastErrorMessage(swapErrorMessage: string): string {
  switch (true) {
    case swapErrorMessage.includes(`overflow x1y1`):
      return 'Swap out amount is too large'
    case swapErrorMessage.includes(`can't create fixidity number larger than`):
      return 'Swap in amount is too large'
    default:
      return 'Unable to fetch swap amount'
  }
}

interface ISwapError {
  message: string
}

interface ISwapData {
  amountWei: string
  quoteWei: string
  quote: string
  rate: string
}
