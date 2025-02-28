import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import type { TokenId } from 'src/config/tokens'
import { logger } from 'src/utils/logger'

import { useAllowance } from './useAllowance'

export function useSwapAllowance(
  chainId: number,
  fromTokenId: TokenId,
  toTokenId: TokenId,
  address: string,
  approveAmount: string
) {
  const { allowance, isLoading: isAllowanceLoading } = useAllowance(
    chainId,
    fromTokenId,
    toTokenId,
    address
  )

  const needsApproval = !isAllowanceLoading && new BigNumber(allowance).lte(approveAmount)
  const skipApprove = !isAllowanceLoading && !needsApproval

  // Log only when values change
  useEffect(() => {
    logger.info('Allowance status:', {
      isLoading: isAllowanceLoading,
      needsApproval,
      allowance,
      approveAmount,
    })
  }, [isAllowanceLoading, needsApproval, allowance, approveAmount])

  return {
    allowance,
    isAllowanceLoading,
    needsApproval,
    skipApprove,
  }
}
