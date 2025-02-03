import { FormikErrors } from 'formik'
import { useCallback } from 'react'
import { MIN_ROUNDED_VALUE } from 'src/config/consts'
import { Tokens, getTokenAddress, getTokenByAddress } from 'src/config/tokens'
import { AccountBalances } from 'src/features/accounts/fetchBalances'
import { getMentoSdk, getTradablePairForTokens } from 'src/features/sdk'
import { IUseFormValidatorProps, SwapFormValues } from 'src/features/swap/types'
import { parseAmount, toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'
import { useChainId } from 'wagmi'

export function useFormValidator({
  balances,
  isBalanceLoaded,
  isWalletConnected,
}: IUseFormValidatorProps) {
  const chainId = useChainId()
  const isAccountReady = isWalletConnected && isBalanceLoaded
  return useCallback(
    async (values: SwapFormValues): Promise<FormikErrors<SwapFormValues>> => {
      const { amount, fromTokenId } = values
      const tokenBalance = balances[fromTokenId]
      return (async () => {
        if (isWalletConnected && !isBalanceLoaded) return { fromTokenId: 'Balance still loading' }
        if (!amount) return { amount: 'Amount Required' }
        const parsedAmount = parseAmount(amount)
        if (!parsedAmount) return { amount: 'Amount is Invalid' }
        const isNegativeAmount = parsedAmount.lt(MIN_ROUNDED_VALUE)
        if (isAccountReady && isNegativeAmount) return { amount: 'Amount too small' }
        const isExceededBalance = toWei(parsedAmount, Tokens[fromTokenId].decimals).gt(tokenBalance)
        if (isAccountReady && isExceededBalance) return { amount: 'Amount exceeds balance' }
        const { exceeds, errorMsg } = await checkTradingLimits(values, chainId)
        if (exceeds) return { amount: errorMsg }
        return {}
      })().catch((error) => {
        logger.error(error)
        return {}
      })
    },
    [balances, chainId, isBalanceLoaded, isWalletConnected]
  )
}

async function checkTradingLimits(
  values: SwapFormValues,
  chainId: number
): Promise<{ exceeds: boolean; errorMsg: string }> {
  const mento = await getMentoSdk(chainId)
  const tradablePair = await getTradablePairForTokens(chainId, values.fromTokenId, values.toTokenId)
  // TODO: handle multiple hops
  const exchangeId = tradablePair.path[0].id
  const tradingLimits = await mento.getTradingLimits(exchangeId)

  let timestampIn = 0
  let timestampOut = 0
  let minMaxIn = Infinity
  let minMaxOut = Infinity

  for (const limit of tradingLimits) {
    if (limit.maxIn < minMaxIn) {
      minMaxIn = limit.maxIn
      timestampIn = limit.until
    }
    if (limit.maxOut < minMaxOut) {
      minMaxOut = limit.maxOut
      timestampOut = limit.until
    }
  }
  const isSwapIn = values.direction === 'in'
  const tokenToCheck = getTokenByAddress(tradingLimits[0].asset).symbol

  let amountToCheck: number
  let exceeds = false
  let limit = 0
  let timestamp = 0

  if (tokenToCheck === values.fromTokenId) {
    amountToCheck = isSwapIn ? +values.amount : +values.quote
    if (amountToCheck > minMaxIn) {
      exceeds = true
      limit = minMaxIn
      timestamp = timestampIn
    }
  } else {
    amountToCheck = isSwapIn ? +values.quote : +values.amount
    if (amountToCheck > minMaxOut) {
      exceeds = true
      limit = minMaxOut
      timestamp = timestampOut
    }
  }

  const date = new Date(timestamp * 1000).toLocaleString()

  if (exceeds) {
    const errorMsg = `The ${tokenToCheck} amount exceeds the current trading limits. The current ${
      tokenToCheck === values.fromTokenId ? 'sell' : 'buy'
    }  limit is ${limit} ${tokenToCheck} until ${date}`
    return {
      exceeds,
      errorMsg,
    }
  }

  return { exceeds, errorMsg: '' }
}
