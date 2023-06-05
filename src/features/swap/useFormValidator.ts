import { SizeLimits, SwapFormValues } from 'src/features/swap/types'
import { TokenId, Tokens } from 'src/config/tokens'
import { areAmountsNearlyEqual, parseAmount, toWei } from 'src/utils/amount'

import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { FormikErrors } from 'formik'
import { MIN_ROUNDED_VALUE } from 'src/config/consts'
import { config } from 'src/config/config'
import { useCallback } from 'react'

export function useFormValidator(balances: AccountBalances, sizeLimits?: SizeLimits | null) {
  return useCallback(
    (values?: SwapFormValues): FormikErrors<SwapFormValues> => {
      if (config.debug) return {} // TODO disable
      if (!values || !values.fromAmount) return { fromAmount: 'Amount Required' }
      const parsedAmount = parseAmount(values.fromAmount)
      if (!parsedAmount) return { fromAmount: 'Amount is Invalid' }
      if (parsedAmount.lt(0)) return { fromAmount: 'Amount cannot be negative' }
      if (parsedAmount.lt(MIN_ROUNDED_VALUE)) return { fromAmount: 'Amount too small' }
      const tokenId = values.fromTokenId
      const tokenBalance = balances[tokenId]
      const weiAmount = toWei(parsedAmount, Tokens[values.fromTokenId].decimals)
      if (weiAmount.gt(tokenBalance) && !areAmountsNearlyEqual(weiAmount, tokenBalance)) {
        return { fromAmount: 'Amount exceeds balance' }
      }
      if (sizeLimits) {
        const stableTokenId =
          values.fromTokenId === TokenId.CELO ? values.toTokenId : values.fromTokenId
        const limits = sizeLimits[stableTokenId]
        if (limits?.min && weiAmount.lt(limits?.min)) return { fromAmount: 'Amount below minimum' }
        if (limits?.max && weiAmount.gt(limits?.max))
          return { fromAmount: 'Amount exceeds maximum' }
      }
      return {}
    },
    [balances, sizeLimits]
  )
}
