import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getMentoSdk, getTradablePairForTokens } from 'src/features/sdk'
import { SwapDirection } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export function useSwapTransaction(
  chainId: number,
  fromToken: TokenId,
  toToken: TokenId,
  amountInWei: string,
  thresholdAmountInWei: string,
  direction: SwapDirection,
  accountAddress?: Address,
  isApproveConfirmed?: boolean
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    [
      'useSwapTransaction',
      chainId,
      fromToken,
      toToken,
      amountInWei,
      thresholdAmountInWei,
      direction,
      accountAddress,
      isApproveConfirmed,
    ],
    async () => {
      if (
        !accountAddress ||
        !isApproveConfirmed ||
        new BigNumber(amountInWei).lte(0) ||
        new BigNumber(thresholdAmountInWei).lte(0)
      ) {
        logger.debug('Skipping swap transaction')
        return null
      }
      const sdk = await getMentoSdk(chainId)
      const fromTokenAddr = getTokenAddress(fromToken, chainId)
      const toTokenAddr = getTokenAddress(toToken, chainId)
      const tradablePair = await getTradablePairForTokens(chainId, fromToken, toToken)
      const swapFn = direction === 'in' ? sdk.swapIn.bind(sdk) : sdk.swapOut.bind(sdk)
      const txRequest = await swapFn(fromTokenAddr, toTokenAddr, amountInWei, thresholdAmountInWei, tradablePair)
      // This should be populated by the SDK as either broker or router, but if it's not, throw an error
      if (!txRequest.to) {
        throw new Error('Swap transaction to address is undefined')
      }
      return { ...txRequest, to: txRequest.to! }
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    isApproveConfirmed && txRequest ? { request: txRequest } : undefined
  )
  const {
    data: txResult,
    isLoading,
    isSuccess,
    error: txSendError,
    sendTransactionAsync,
  } = useSendTransaction(config)

  useEffect(() => {
    if (txPrepError || (sendPrepError?.message && !isLoading && !isSuccess)) {
      toast.error('Unable to prepare swap transaction')
      logger.error(txPrepError || sendPrepError?.message)
    } else if (txSendError) {
      toast.error('Unable to execute swap transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, sendPrepError, isLoading, isSuccess, txSendError])

  return {
    sendSwapTx: sendTransactionAsync,
    swapTxResult: txResult,
    isSwapTxLoading: isLoading,
    isSwapTxSuccess: isSuccess,
  }
}
