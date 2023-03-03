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

  // TODO cleanup
  // https://github.com/wagmi-dev/wagmi/discussions/1564#discussioncomment-4500558
  // useEffect(() => {
  //   if (isApproveConfirmed) refetch().catch((e) => logger.error('Error refetching swap prepare', e))
  // }, [isApproveConfirmed, refetch])

  // https://github.com/wagmi-dev/wagmi/discussions/1564#discussioncomment-4500558
  // useInterval(refetch, 500)

  useEffect(() => {
    if (txPrepError || sendPrepError) {
      toast.error('Unable to prepare swap transaction')
      logger.error(txPrepError)
    } else if (txSendError) {
      toast.error('Unable to execute swap transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, sendPrepError, txSendError])

  return {
    sendSwapTx: sendTransactionAsync,
    swapTxResult: txResult,
    isSwapTxLoading: isLoading,
    isSwapTxSuccess: isSuccess,
  }
}
