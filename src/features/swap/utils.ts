// import { WEI_PER_UNIT } from 'src/config/consts'
// import { toWei } from 'src/utils/amount'
// import { logger } from 'src/utils/logger'

import BigNumber from 'bignumber.js'
import { WEI_PER_UNIT } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import { ToCeloRates } from 'src/features/swap/types'
import {
  fromWeiRounded,
  NumberT,
  parseAmount,
  parseAmountWithDefault,
  toWei,
} from 'src/utils/amount'
import { logger } from 'src/utils/logger'

interface ExchangeValues {
  from: {
    amount: string
    weiAmount: string
    token: NativeTokenId
  }
  to: {
    amount: string
    weiAmount: string
    token: NativeTokenId
  }
  rate: {
    value: number
    weiValue: string
    fromCeloValue: string
    fromCeloWeiValue: string
    weiBasis: string
    lastUpdated: number
    isReady: boolean
  }
  stableTokenId: NativeTokenId
}

export function useExchangeValues(
  fromAmount: NumberT | null | undefined,
  fromTokenId: NativeTokenId | null | undefined,
  toTokenId: NativeTokenId | null | undefined,
  toCeloRates: ToCeloRates,
  isFromAmountWei = false
): ExchangeValues {
  // Return some defaults when values are missing
  if (!fromTokenId || !toTokenId || !toCeloRates) return getDefaultExchangeValues()

  const sellCelo = fromTokenId === NativeTokenId.CELO
  const stableTokenId = sellCelo ? toTokenId : fromTokenId
  const toCeloRate = toCeloRates[stableTokenId]
  if (!toCeloRate) return getDefaultExchangeValues(fromTokenId, toTokenId)

  const { stableBucket, celoBucket, spread } = toCeloRate
  const [buyBucket, sellBucket] = sellCelo ? [stableBucket, celoBucket] : [celoBucket, stableBucket]

  const fromAmountWei = parseInputExchangeAmount(fromAmount, isFromAmountWei)
  const { exchangeRateNum, exchangeRateWei, fromCeloRateWei, toAmountWei } = calcSimpleExchangeRate(
    fromAmountWei,
    buyBucket,
    sellBucket,
    spread,
    sellCelo
  )

  return {
    from: {
      amount: fromWeiRounded(fromAmountWei, true),
      weiAmount: fromAmountWei.toString(),
      token: fromTokenId,
    },
    to: {
      amount: fromWeiRounded(toAmountWei, true),
      weiAmount: toAmountWei.toString(),
      token: toTokenId,
    },
    rate: {
      value: exchangeRateNum,
      weiValue: exchangeRateWei.toString(),
      fromCeloValue: fromWeiRounded(fromCeloRateWei, true),
      fromCeloWeiValue: fromCeloRateWei.toString(),
      weiBasis: WEI_PER_UNIT,
      lastUpdated: toCeloRate.lastUpdated,
      isReady: true,
    },
    stableTokenId,
  }
}

function parseInputExchangeAmount(amount: NumberT | null | undefined, isWei: boolean) {
  const parsed = parseAmountWithDefault(amount, 0)
  const parsedWei = isWei ? parsed : toWei(parsed)
  return BigNumber.max(parsedWei, 0)
}

export function calcSimpleExchangeRate(
  amountInWei: NumberT,
  buyBucket: string,
  sellBucket: string,
  spread: string,
  sellCelo: boolean
) {
  try {
    const fromAmount = parseAmount(amountInWei)
    const simulate = !fromAmount || fromAmount.lte(0)
    // If no valid from amount provided, simulate rate with 1 unit
    const fromAmountAdjusted = simulate ? new BigNumber(WEI_PER_UNIT) : fromAmount

    const spreadFactor = new BigNumber(1).minus(spread)
    const reducedSellAmt = fromAmountAdjusted.multipliedBy(spreadFactor)

    const toAmount = reducedSellAmt
      .multipliedBy(buyBucket)
      .dividedBy(reducedSellAmt.plus(sellBucket))

    const exchangeRateNum = toAmount.dividedBy(fromAmountAdjusted).toNumber()
    const exchangeRateWei = toWei(exchangeRateNum)
    const fromCeloRateWei = sellCelo
      ? exchangeRateWei
      : toWei(fromAmountAdjusted.dividedBy(toAmount).toNumber())

    // The FixedNumber interface isn't very friendly, need to strip out the decimal manually for BigNumber
    const toAmountWei = new BigNumber(simulate ? 0 : toAmount).toFixed(0, BigNumber.ROUND_DOWN)

    return { exchangeRateNum, exchangeRateWei, fromCeloRateWei, toAmountWei }
  } catch (error) {
    logger.warn('Error computing exchange values')
    return { exchangeRateNum: 0, exchangeRateWei: '0', fromCeloRateWei: '0', toAmountWei: '0' }
  }
}

function getDefaultExchangeValues(
  _fromToken?: NativeTokenId | null,
  _toToken?: NativeTokenId | null
): ExchangeValues {
  const fromToken = _fromToken || NativeTokenId.CELO
  const toToken = _toToken || NativeTokenId.cUSD
  const stableTokenId = fromToken === NativeTokenId.CELO ? toToken : fromToken
  return {
    from: {
      amount: '0',
      weiAmount: '0',
      token: fromToken,
    },
    to: {
      amount: '0',
      weiAmount: '0',
      token: toToken,
    },
    rate: {
      value: 0,
      weiValue: '0',
      fromCeloValue: '0',
      fromCeloWeiValue: '0',
      weiBasis: WEI_PER_UNIT,
      lastUpdated: 0,
      isReady: false,
    },
    stableTokenId,
  }
}
