import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { getMentoSdk } from '../sdk'

export function useSwapTransaction(
  chainId: number,
  fromToken: TokenId,
  toToken: TokenId,
  fromAmountInWei: string,
  minOutInWei: string,
  address?: Address,
  isApproveConfirmed?: boolean
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    [fromToken, toToken, fromAmountInWei, minOutInWei, address, isApproveConfirmed],
    async () => {
      if (
        !address ||
        !isApproveConfirmed ||
        new BigNumber(fromAmountInWei).lte(0) ||
        new BigNumber(minOutInWei).lte(0)
      )
        return null
      const sdk = await getMentoSdk(chainId)
      const fromTokenAddr = getTokenAddress(fromToken, chainId)
      const toTokenAddr = getTokenAddress(toToken, chainId)
      const txRequest = await sdk.swapIn(fromTokenAddr, toTokenAddr, fromAmountInWei, minOutInWei)
      return { ...txRequest, to: sdk.getBroker().address }
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
