import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { SWAP_QUOTE_REFETCH_INTERVAL } from 'src/config/consts'
import { TokenId, Tokens, getTokenAddress } from 'src/config/tokens'
import { getMentoSdk } from 'src/features/sdk'
import { SwapDirection } from 'src/features/swap/types'
import { calcExchangeRate } from 'src/features/swap/utils'
import { fromWeiRounded } from 'src/utils/amount'
import { useDebounce } from 'src/utils/debounce'
import { logger } from 'src/utils/logger'
import { useChainId } from 'wagmi'

// export function useSwapOutQuote(
//   fromAmount: string | number,
//   fromAmountWei: string,
//   fromTokenId: TokenId,
//   toTokenId: TokenId
// ) {
//   const chainId = useChainId()

//   const debouncedFromAmountWei = useDebounce(fromAmountWei, 350)

//   const { isLoading, isError, error, data } = useQuery(
//     ['useSwapOutQuote', debouncedFromAmountWei, fromTokenId, toTokenId],
//     async () => {
//       const fromAmountBN = ethers.BigNumber.from(debouncedFromAmountWei)
//       if (fromAmountBN.lte(0) || !fromTokenId || !toTokenId) return null
//       const mento = await getMentoSdk(chainId)
//       const fromTokenAddr = getTokenAddress(fromTokenId, chainId)
//       const toTokenAddr = getTokenAddress(toTokenId, chainId)
//       const toAmountWei = (
//         await mento.getAmountOut(fromTokenAddr, toTokenAddr, fromAmountBN)
//       ).toString()
//       const toAmount = fromWeiRounded(toAmountWei, Tokens[toTokenId].decimals)
//       return {
//         toAmountWei,
//         toAmount,
//         rate: calcExchangeRate(fromAmount, toAmount),
//       }
//     },
//     {
//       staleTime: SWAP_QUOTE_REFETCH_INTERVAL,
//       refetchInterval: SWAP_QUOTE_REFETCH_INTERVAL,
//     }
//   )

//   useEffect(() => {
//     if (error) {
//       toast.error('Unable to fetch swap out amount')
//       logger.error(error)
//     }
//   }, [error])

//   return {
//     isLoading,
//     isError,
//     toAmountWei: data?.toAmountWei || '0',
//     toAmount: data?.toAmount || '0',
//     rate: data?.rate,
//   }
// }

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
      const amountBN = ethers.BigNumber.from(debouncedAmountWei)
      const fromToken = Tokens[fromTokenId]
      const toToken = Tokens[fromTokenId]
      if (amountBN.lte(0) || !fromToken || !toToken) return null
      const fromTokenAddr = getTokenAddress(fromTokenId, chainId)
      const toTokenAddr = getTokenAddress(toTokenId, chainId)
      const mento = await getMentoSdk(chainId)

      let quoteWei: string
      if (direction === 'in') {
        quoteWei = (await mento.getAmountOut(fromTokenAddr, toTokenAddr, amountBN)).toString()
      } else {
        quoteWei = (await mento.getAmountIn(fromTokenAddr, toTokenAddr, amountBN)).toString()
      }

      const quote = fromWeiRounded(quoteWei, Tokens[toTokenId].decimals)
      const fromAmount = direction === 'in' ? amountWei : quoteWei
      const fromDecimals = direction === 'in' ? fromToken.decimals : toToken.decimals
      const toAmount = direction === 'in' ? quoteWei : amountWei
      const toDecimals = direction === 'in' ? toToken.decimals : fromToken.decimals
      const rate = calcExchangeRate(fromAmount, fromDecimals, toAmount, toDecimals)
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
