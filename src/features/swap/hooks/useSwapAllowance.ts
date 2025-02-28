import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import type { TokenId } from 'src/config/tokens'
import { logger } from 'src/utils/logger'

import { useAllowance } from './useAllowance'

interface ISwapAllowanceOptions {
  chainId: number
  fromTokenId: TokenId
  toTokenId: TokenId
  approveAmount: string
  address?: string
}

export function useSwapAllowance(options: ISwapAllowanceOptions) {
  const { chainId, fromTokenId, toTokenId, approveAmount, address } = options
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
