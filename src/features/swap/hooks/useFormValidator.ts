import { FormikErrors } from 'formik'
import { useCallback } from 'react'
import { MIN_ROUNDED_VALUE } from 'src/config/consts'
import { TokenId, Tokens, getTokenAddress, getTokenByAddress } from 'src/config/tokens'
import { getMentoSdk, getTradablePairForTokens } from 'src/features/sdk'
import { IUseFormValidatorProps, SwapFormValues } from 'src/features/swap/types'
import { parseInputExchangeAmount } from 'src/features/swap/utils'
import { fromWei, parseAmount, toWei } from 'src/utils/amount'
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
    [balances, chainId, isAccountReady]
  )
}

async function checkTradingLimits(
  values: SwapFormValues,
  chainId: number
): Promise<{ exceeds: boolean; errorMsg: string }> {
  const mento = await getMentoSdk(chainId)
  const tradablePair = await getTradablePairForTokens(chainId, values.fromTokenId, values.toTokenId)
  let assetIn = getTokenAddress(values.fromTokenId, chainId)
  let amount = values.amount

  // Check limits for each path in the swap
  for (let i = 0; i < tradablePair.path.length; i++) {
    const path = tradablePair.path[i]
    const exchangeId = path.id
    const tradingLimits = await mento.getTradingLimits(exchangeId)
    const isSwapIn = values.direction === 'in'
    const assetOut = path.assets[0] === assetIn ? path.assets[1] : path.assets[0]

    const tokenIn = getTokenByAddress(assetIn)
    const tokenOut = getTokenByAddress(assetOut)

    const pair = await getTradablePairForTokens(
      chainId,
      tokenIn.id as TokenId,
      tokenOut.id as TokenId
    )
    const amountWei = parseInputExchangeAmount(
      amount,
      isSwapIn ? (tokenIn.id as TokenId) : (tokenOut.id as TokenId)
    )

    const quoteWei = (
      isSwapIn
        ? await mento.getAmountOut(assetIn, assetOut, amountWei, pair)
        : await mento.getAmountIn(assetIn, assetOut, amountWei, pair)
    ).toString()
    const quoteDecimals = isSwapIn ? tokenOut.decimals : tokenIn.decimals
    const quote = fromWei(quoteWei, quoteDecimals)

    for (const asset of [assetIn, assetOut]) {
      // Find the trading limits for the specific asset we're checking
      const assetLimits = tradingLimits.filter((limit) => limit.asset === asset)

      if (assetLimits.length === 0) {
        continue // Skip if no limits found for this asset
      }

      let timestampIn = 0
      let timestampOut = 0
      let minMaxIn = Infinity
      let minMaxOut = Infinity

      for (const limit of assetLimits) {
        if (limit.maxIn < minMaxIn) {
          minMaxIn = limit.maxIn
          timestampIn = limit.until
        }
        if (limit.maxOut < minMaxOut) {
          minMaxOut = limit.maxOut
          timestampOut = limit.until
        }
      }

      let amountToCheck: number
      if (asset === assetIn) {
        amountToCheck = isSwapIn ? +amount : +quote
      } else {
        amountToCheck = isSwapIn ? +quote : +amount
      }

      let exceeds = false
      let limit = 0
      let timestamp = 0

      if (isSwapIn) {
        if (amountToCheck > minMaxIn) {
          exceeds = true
          limit = minMaxIn
          timestamp = timestampIn
        }
      } else {
        if (amountToCheck > minMaxOut) {
          exceeds = true
          limit = minMaxOut
          timestamp = timestampOut
        }
      }

      if (exceeds) {
        const date = new Date(timestamp * 1000).toLocaleString()
        const errorMsg = `The ${
          getTokenByAddress(asset).symbol
        } amount exceeds the current trading limits. The current
          limit is ${limit} ${getTokenByAddress(asset).symbol} until ${date}`
        return {
          exceeds,
          errorMsg,
        }
      }
    }
    amount = quote
    assetIn = assetOut
  }

  return { exceeds: false, errorMsg: '' }
}
