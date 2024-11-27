import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getMentoSdk } from 'src/features/sdk'
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
  needsApproval: boolean,
  accountAddress?: Address,
  isApproveConfirmed?: boolean
) {
  logger.info('Entered useSwapTransaction hook')
  logger.info(`Needs approval: ${needsApproval}`)
  logger.info(`Is approve confirmed: ${isApproveConfirmed}`)

  let canSwap = false

  if (needsApproval) {
    canSwap = isApproveConfirmed ?? false
  } else {
    canSwap = true
  }

  logger.info(`Can swap: ${canSwap}`)

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
      canSwap,
    ],
    async () => {
      if (
        !accountAddress ||
        !canSwap ||
        new BigNumber(amountInWei).lte(0) ||
        new BigNumber(thresholdAmountInWei).lte(0)
      ) {
        logger.info('Returning null')
        return null
      }

      const sdk = await getMentoSdk(chainId)
      const fromTokenAddr = getTokenAddress(fromToken, chainId)
      const toTokenAddr = getTokenAddress(toToken, chainId)
      const brokerAddr = sdk.getBroker().address
      const swapFn = direction === 'in' ? sdk.swapIn.bind(sdk) : sdk.swapOut.bind(sdk)
      const txRequest = await swapFn(fromTokenAddr, toTokenAddr, amountInWei, thresholdAmountInWei)
      return { ...txRequest, to: brokerAddr }
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    canSwap && txRequest ? { request: txRequest } : undefined
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
      toast.error('Unable to prepare swap transaction. If this persists, please contact support.')
      logger.error(`Error preparing swap transaction: ${txPrepError || sendPrepError?.message}`)
    } else if (txSendError) {
      toast.error('Unable to prepare swap transaction. If this persists, please contact support.')
      logger.error(`Error preparing swap transaction: ${txSendError}`)
    }
  }, [txPrepError, sendPrepError, isLoading, isSuccess, txSendError])

  return {
    sendSwapTx: sendTransactionAsync,
    swapTxResult: txResult,
    isSwapTxLoading: isLoading,
    isSwapTxSuccess: isSuccess,
  }
}
