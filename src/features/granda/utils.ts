import BigNumber from 'bignumber.js'
import { WEI_PER_UNIT } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import { OracleRates } from 'src/features/granda/types'
import {
  ExchangeValues,
  getDefaultExchangeValues,
  parseInputExchangeAmount,
} from 'src/features/swap/utils'
import { fromWei, fromWeiRounded, NumberT, toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'

// Takes raw input and rates info and computes/formats to convenient form
export function getExchangeValues(
  fromAmount: NumberT | null | undefined,
  fromTokenId: NativeTokenId | null | undefined,
  toTokenId: NativeTokenId | null | undefined,
  spread: BigNumber.Value | null | undefined,
  oracleRates: OracleRates
): ExchangeValues {
  try {
    // Return some defaults when values are missing
    if (!fromTokenId || !toTokenId || !oracleRates || spread === null || spread === undefined)
      return getDefaultExchangeValues()

    const sellCelo = fromTokenId === NativeTokenId.CELO
    const stableTokenId = sellCelo ? toTokenId : fromTokenId
    const fromCeloRate = oracleRates[stableTokenId]
    if (!fromCeloRate) return getDefaultExchangeValues(fromTokenId, toTokenId)

    const { rate: fromCeloRateNum } = fromCeloRate
    const fromCeloRateWei = toWei(fromCeloRateNum)
    const toCeloRateNum = 1 / fromCeloRateNum
    const toCeloRateWei = toWei(toCeloRateNum)
    const exchangeRateNum = sellCelo ? fromCeloRateNum : toCeloRateNum
    const exchangeRateWei = sellCelo ? fromCeloRateWei : toCeloRateWei

    const fromAmountWei = parseInputExchangeAmount(fromAmount, false)
    const toAmountWei = getBuyAmount(fromAmountWei, exchangeRateNum, spread)

    return {
      from: {
        amount: fromWei(fromAmountWei).toFixed(2),
        weiAmount: fromAmountWei.toString(),
        token: fromTokenId,
      },
      to: {
        amount: fromWei(toAmountWei).toFixed(2),
        weiAmount: toAmountWei.toString(),
        token: toTokenId,
      },
      rate: {
        value: exchangeRateNum,
        weiValue: exchangeRateWei.toString(),
        fromCeloValue: fromWeiRounded(fromCeloRateWei, true),
        fromCeloWeiValue: fromCeloRateWei.toString(),
        weiBasis: WEI_PER_UNIT,
        lastUpdated: fromCeloRate.lastUpdated,
        isReady: true,
      },
      stableTokenId,
    }
  } catch (error) {
    logger.warn('Error computing exchange values', error)
    return getDefaultExchangeValues()
  }
}

// Should match GetBuyAmount in https://github.com/celo-org/celo-monorepo/blob/master/packages/protocol/contracts/stability/GrandaMento.sol
function getBuyAmount(
  amountInWei: BigNumber.Value,
  exchangeRate: BigNumber.Value,
  spread: BigNumber.Value
): BigNumber {
  const adjustedAmount = new BigNumber(amountInWei).times(new BigNumber(1).minus(spread))
  return adjustedAmount.times(exchangeRate)
}
