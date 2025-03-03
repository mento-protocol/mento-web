import type { SendTransactionResult } from '@wagmi/core'
import { useMemo } from 'react'
import { TokenId } from 'src/config/tokens'

interface SwapState {
  text: string
  disabled: boolean
}

interface UseSwapStateProps {
  isAllowanceLoading: boolean
  skipApprove: boolean
  sendApproveTx: (() => Promise<SendTransactionResult>) | undefined
  isApproveTxLoading: boolean
  isApproveTxSuccess: boolean
  sendSwapTx: (() => Promise<SendTransactionResult>) | undefined
  fromTokenId: TokenId
}

/**
 * This hook is used to determine the text and disabled state of the submit button on the SwapConfirm form.
 *
 * We have the following possible states:
 * 1. Checking Allowance (isAllowanceLoading is true)
 * 2. Approval needed (skipApprove is false and...)
 *    a) Approval transaction preparing, not yet ready to send (sendApproveTx is falsy)
 *    b) Approval transaction ready to send (sendApproveTx is truthy, isApproveTxLoading is false, isApproveTxSuccess is false)
 *    c) Approval transaction sent but not finalized yet (sendApproveTx is truthy, isApproveTxLoading is true, isApproveTxSuccess is false)
 *    d) Approval transaction successful (isApproveTxLoading is false, isApproveTxSuccess is true)
 * 3. No approval needed (skipApprove is true)
 *    a) Swap transaction preparing, not yet ready to send (isSwapReady is false)
 *    b) Swap transaction ready to send (isSwapReady is true)
 */
export function useSwapState(props: UseSwapStateProps): SwapState {
  const {
    fromTokenId,
    skipApprove,
    isAllowanceLoading,
    isApproveTxLoading,
    isApproveTxSuccess,
    sendApproveTx,
    sendSwapTx,
  } = props

  return useMemo(() => {
    // 1. Checking Allowance
    if (isAllowanceLoading) {
      return {
        text: `Checking ${fromTokenId} allowance...`,
        disabled: true,
      }
    }

    // 2. Approval Flow
    if (!skipApprove) {
      if (!sendApproveTx) {
        return {
          text: 'Preparing Approve Transaction...',
          disabled: true,
        }
      }
      if (isApproveTxLoading) {
        return {
          text: `Approving ${fromTokenId}...`,
          disabled: true,
        }
      }
      if (!isApproveTxSuccess) {
        return {
          text: `Approve ${fromTokenId}`,
          disabled: false,
        }
      }
    }

    // 3. Swap Flow
    if (!sendSwapTx) {
      return {
        text: 'Preparing Swap Transaction...',
        disabled: true,
      }
    }

    return {
      text: 'Swap',
      disabled: false,
    }
  }, [
    isAllowanceLoading,
    skipApprove,
    sendApproveTx,
    isApproveTxLoading,
    isApproveTxSuccess,
    sendSwapTx,
    fromTokenId,
  ])
}
