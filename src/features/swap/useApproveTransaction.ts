import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ERC20_ABI } from 'src/config/consts'
import { BrokerAddresses } from 'src/config/exchanges'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import { getMentoSdk } from 'src/features/sdk'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

async function checkAllowance(
  tokenAddr: string,
  accountAddress: string,
  chainId: number,
  amountInWei: string
): Promise<boolean> {
  logger.info(`Checking Broker allowance for token ${tokenAddr} on chain ${chainId}`)
  const provider = getProvider(chainId)
  const contract = new Contract(tokenAddr, ERC20_ABI, provider)
  const brokerAddress = BrokerAddresses[chainId as keyof typeof BrokerAddresses]

  const allowance = await contract.allowance(accountAddress, brokerAddress)
  logger.info(`Allowance: ${allowance.toString()}`)

  const approvalRequired = allowance.lt(amountInWei.toString())
  return approvalRequired
}

export function useApproveTransaction(
  chainId: number,
  tokenId: TokenId,
  amountInWei: string,
  accountAddress?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useApproveTransaction', chainId, tokenId, amountInWei, accountAddress],
    async () => {
      if (!accountAddress || new BigNumber(amountInWei).lte(0)) return null
      const sdk = await getMentoSdk(chainId)
      const tokenAddr = getTokenAddress(tokenId, chainId)

      let needsApproval = false

      try {
        needsApproval = await checkAllowance(tokenAddr, accountAddress, chainId, amountInWei)
      } catch (error) {
        logger.error(`Failed to check allowance: ${error}`)
      }

      logger.info(`Needs approval: ${needsApproval}`)

      if (!needsApproval) return { txRequest: null, needsApproval: false }

      const txRequest = await sdk.increaseTradingAllowance(tokenAddr, amountInWei)
      return { txRequest: { ...txRequest, to: tokenAddr }, needsApproval: true }
    },
    {
      retry: false,
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    txRequest?.txRequest ? { request: txRequest.txRequest } : undefined
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
    needsApproval: txRequest?.needsApproval ?? false,
  }
}
