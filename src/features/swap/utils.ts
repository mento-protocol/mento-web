import { BigNumber, BigNumberish, FixedNumber } from 'ethers'
import { WEI_PER_UNIT } from 'src/config/consts'
import { toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'

// TODO
// export function useExchangeValues(
//   fromAmount: number | string | null | undefined,
//   fromTokenId: string | null | undefined,
//   toTokenId: string | null | undefined,
//   balances: Balances,
//   toCeloRates: ToCeloRates,
//   isFromAmountWei: boolean
// ) {
//   // Return some defaults when values are missing
//   if (!fromTokenId || !toTokenId || !toCeloRates) return getDefaultExchangeValues(cUSD, CELO)

//   const sellCelo = fromTokenId === CELO.id
//   const fromToken = balances.tokens[fromTokenId]
//   const toToken = balances.tokens[toTokenId]
//   const stableTokenId = sellCelo ? toTokenId : fromTokenId
//   const toCeloRate = toCeloRates[stableTokenId]
//   if (!toCeloRate) return getDefaultExchangeValues(fromToken, toToken)

//   const { stableBucket, celoBucket, spread } = toCeloRate
//   const [buyBucket, sellBucket] = sellCelo ? [stableBucket, celoBucket] : [celoBucket, stableBucket]

//   const fromAmountWei = parseInputAmount(fromAmount, isFromAmountWei)
//   const { exchangeRateNum, exchangeRateWei, fromCeloRateWei, toAmountWei } = calcSimpleExchangeRate(
//     fromAmountWei,
//     buyBucket,
//     sellBucket,
//     spread,
//     sellCelo
//   )

//   return {
//     from: {
//       weiAmount: fromAmountWei.toString(),
//       token: fromToken,
//     },
//     to: {
//       weiAmount: toAmountWei.toString(),
//       token: toToken,
//     },
//     rate: {
//       value: exchangeRateNum,
//       weiValue: exchangeRateWei.toString(),
//       fromCeloWeiValue: fromCeloRateWei.toString(),
//       weiBasis: WEI_PER_UNIT,
//       lastUpdated: toCeloRate.lastUpdated,
//       isReady: true,
//     },
//   }
// }

// function parseInputAmount(amount: BigNumberish | null | undefined, isWei: boolean) {
//   const zero = BigNumber.from(0)
//   try {
//     if (!amount) return zero
//     const parsed = isWei ? BigNumber.from(amount) : toWei(amount)
//     if (parsed.isNegative()) return zero
//     return parsed
//   } catch (error) {
//     logger.warn('Error parsing input amount')
//     return zero
//   }
// }

export function calcSimpleExchangeRate(
  amountInWei: BigNumberish,
  buyBucket: string,
  sellBucket: string,
  spread: string,
  sellCelo: boolean
) {
  try {
    const fromAmountFN = FixedNumber.from(amountInWei)
    const simulate = fromAmountFN.isZero() || fromAmountFN.isNegative()
    // If no valid from amount provided, simulate rate with 1 unit
    const fromAmountAdjusted = simulate ? FixedNumber.from(WEI_PER_UNIT) : fromAmountFN

    const reducedSellAmt = fromAmountAdjusted.mulUnsafe(
      FixedNumber.from(1).subUnsafe(FixedNumber.from(spread))
    )
    const toAmountFN = reducedSellAmt
      .mulUnsafe(FixedNumber.from(buyBucket))
      .divUnsafe(reducedSellAmt.addUnsafe(FixedNumber.from(sellBucket)))

    const exchangeRateNum = toAmountFN.divUnsafe(fromAmountAdjusted).toUnsafeFloat()
    const exchangeRateWei = toWei(exchangeRateNum)
    const fromCeloRateWei = sellCelo
      ? exchangeRateWei
      : toWei(fromAmountAdjusted.divUnsafe(toAmountFN).toUnsafeFloat())

    // The FixedNumber interface isn't very friendly, need to strip out the decimal manually for BigNumber
    const toAmountWei = BigNumber.from(simulate ? 0 : toAmountFN.floor().toString().split('.')[0])

    return { exchangeRateNum, exchangeRateWei, fromCeloRateWei, toAmountWei }
  } catch (error) {
    logger.warn('Error computing exchange values')
    return { exchangeRateNum: 0, exchangeRateWei: '0', fromCeloRateWei: '0', toAmountWei: '0' }
  }
}

// function getDefaultExchangeValues(
//   _fromToken: Token | null | undefined,
//   _toToken: Token | null | undefined
// ) {
//   const fromToken = _fromToken || cUSD
//   const toToken = _toToken || CELO

//   return {
//     from: {
//       weiAmount: '0',
//       token: fromToken,
//     },
//     to: {
//       weiAmount: '0',
//       token: toToken,
//     },
//     rate: {
//       value: 0,
//       weiValue: '0',
//       fromCeloWeiValue: '0',
//       weiBasis: WEI_PER_UNIT,
//       lastUpdated: 0,
//       isReady: false,
//     },
//   }
// }
