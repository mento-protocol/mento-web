import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { getMentoSdk } from '../sdk'

export function useApproveTransaction(
  chainId: number,
  tokenId: TokenId,
  amountInWei: string,
  address?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useApproveTransaction', tokenId, amountInWei, address],
    async () => {
      if (!address || new BigNumber(amountInWei).lte(0)) return null
      const sdk = await getMentoSdk(chainId)
      const tokenAddr = getTokenAddress(tokenId, chainId)
      const txRequest = await sdk.increaseTradingAllowance(tokenAddr, amountInWei)
      return { ...txRequest, to: tokenAddr }
    },
    {
      retry: false,
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    txRequest ? { request: txRequest } : undefined
  )
  const {
    data: txResult,
    isLoading,
    isSuccess,
    error: txSendError,
    sendTransactionAsync,
  } = useSendTransaction(config)

  useEffect(() => {
    if (txPrepError || sendPrepError?.message) {
      toast.error('Unable to prepare approval transaction')
      logger.error(txPrepError || sendPrepError?.message)
    } else if (txSendError) {
      toast.error('Unable to execute approval transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, sendPrepError, txSendError])

  return {
    sendApproveTx: sendTransactionAsync,
    approveTxResult: txResult,
    isApproveTxLoading: isLoading,
    isApproveTxSuccess: isSuccess,
  }
}
