import { FormikErrors } from 'formik'
import { useCallback } from 'react'
import { MIN_ROUNDED_VALUE } from 'src/config/consts'
import { TokenId, Tokens } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { SizeLimits, SwapFormValues } from 'src/features/swap/types'
import { areAmountsNearlyEqual, parseAmount, toWei } from 'src/utils/amount'

export function useFormValidator(balances: AccountBalances, sizeLimits?: SizeLimits | null) {
  return useCallback(
    (values?: SwapFormValues): FormikErrors<SwapFormValues> => {
      if (!values || !values.amount) return { amount: 'Amount Required' }
      const parsedAmount = parseAmount(values.amount)
      if (!parsedAmount) return { amount: 'Amount is Invalid' }
      if (parsedAmount.lt(0)) return { amount: 'Amount cannot be negative' }
      if (parsedAmount.lt(MIN_ROUNDED_VALUE)) return { amount: 'Amount too small' }
      const tokenId = values.fromTokenId
      const tokenBalance = balances[tokenId]
      const weiAmount = toWei(parsedAmount, Tokens[values.fromTokenId].decimals)
      if (weiAmount.gt(tokenBalance) && !areAmountsNearlyEqual(weiAmount, tokenBalance)) {
        return { amount: 'Amount exceeds balance' }
      }
      if (sizeLimits) {
        const stableTokenId =
          values.fromTokenId === TokenId.CELO ? values.toTokenId : values.fromTokenId
        const limits = sizeLimits[stableTokenId]
        if (limits?.min && weiAmount.lt(limits?.min)) return { amount: 'Amount below minimum' }
        if (limits?.max && weiAmount.gt(limits?.max)) return { amount: 'Amount exceeds maximum' }
      }
      return {}
    },
    [balances, sizeLimits]
  )
}
