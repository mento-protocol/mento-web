import { NumberT, fromWeiRounded, parseAmountWithDefault, toWei } from 'src/utils/amount'
import { TokenId, Tokens } from 'src/config/tokens'

import BigNumber from 'bignumber.js'
import { logger } from 'src/utils/logger'

export interface ExchangeValues {
  from: {
    amount: string
    weiAmount: string
    token: TokenId
  }
  to: {
    token: TokenId
    amount?: string
    weiAmount?: string
  }
  stableTokenId: TokenId
}

// Takes raw input and rates info and computes/formats to convenient form
export function formatExchangeValues(
  fromAmount: NumberT | null | undefined,
  fromTokenId: TokenId | null | undefined,
  toTokenId: TokenId | null | undefined
): ExchangeValues {
  try {
    // Return some defaults when values are missing
    if (!fromAmount || !fromTokenId || !toTokenId) return getDefaultExchangeValues()

    const sellCelo = fromTokenId === TokenId.CELO
    const stableTokenId = sellCelo ? toTokenId : fromTokenId

    const fromAmountWei = parseInputExchangeAmount(fromAmount, fromTokenId, false)

    return {
      from: {
        amount: fromWeiRounded(fromAmountWei, Tokens[fromTokenId].decimals ,true),
        weiAmount: fromAmountWei.toFixed(0),
        token: fromTokenId,
      },
      to: {
        token: toTokenId,
      },
      stableTokenId,
    }
  } catch (error) {
    logger.warn('Error computing exchange values', error)
    return getDefaultExchangeValues()
  }
}

export function parseInputExchangeAmount(amount: NumberT | null | undefined, tokenId:TokenId, isWei: boolean) {
  const parsed = parseAmountWithDefault(amount, 0)
  const parsedWei = isWei ? parsed : toWei(parsed, Tokens[tokenId].decimals)
  return BigNumber.max(parsedWei, 0)
}

export function getDefaultExchangeValues(
  _fromToken?: TokenId | null,
  _toToken?: TokenId | null
): ExchangeValues {
  const fromToken = _fromToken || TokenId.CELO
  const toToken = _toToken || TokenId.cUSD
  const stableTokenId = fromToken === TokenId.CELO ? toToken : fromToken
  return {
    from: {
      amount: '0',
      weiAmount: '0',
      token: fromToken,
    },
    to: {
      token: toToken,
    },
    stableTokenId,
  }
}

export function getMinBuyAmount(
  amountInWei: BigNumber.Value,
  slippage: BigNumber.Value
): BigNumber {
  const slippageFactor = new BigNumber(slippage).div(100).minus(1).times(-1)
  return new BigNumber(amountInWei).times(slippageFactor).decimalPlaces(0)
}