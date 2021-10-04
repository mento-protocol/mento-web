import BigNumber from 'bignumber.js'
import { DISPLAY_DECIMALS, MIN_ROUNDED_VALUE, WEI_PER_UNIT } from 'src/config/consts'
import { logger } from 'src/utils/logger'
import { fromWei as web3FromWei, toWei as web3ToWei } from 'web3-utils'

export type NumberT = BigNumber | string | number

export function fromWei(value: NumberT | null | undefined): number {
  if (!value) return 0
  return parseFloat(web3FromWei(value.toString()))
}

// Similar to fromWei above but rounds to set number of decimals
// with a minimum floor, configured per token
export function fromWeiRounded(
  value: NumberT | null | undefined,
  roundDownIfSmall = false
): string {
  if (!value) return '0'

  const amount = new BigNumber(web3FromWei(value.toString()))
  if (amount.isZero()) return '0'

  // If amount is less than min value
  if (amount.lt(MIN_ROUNDED_VALUE)) {
    if (roundDownIfSmall) return '0'
    else return MIN_ROUNDED_VALUE.toString()
  }

  return amount.toFixed(DISPLAY_DECIMALS).toString()
}

export function toWei(value: NumberT | null | undefined): BigNumber {
  if (!value) return new BigNumber(0)
  const valueString = value.toString()
  const components = valueString.split('.')
  if (components.length === 1) {
    return new BigNumber(web3ToWei(value.toString()))
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1)
    return new BigNumber(web3ToWei(`${components[0]}.${trimmedFraction}`))
  } else {
    throw new Error(`Cannot convert ${valueString} to wei`)
  }
}

export function parseAmount(value: NumberT | null | undefined): BigNumber | null {
  try {
    if (!value) return null
    const parsed = new BigNumber(value)
    if (!parsed || parsed.isNaN() || !parsed.isFinite()) return null
    else return parsed
  } catch (error) {
    logger.warn('Error parsing amount', value)
    return null
  }
}

export function parseAmountWithDefault(
  value: NumberT | null | undefined,
  defaultValue: NumberT
): BigNumber {
  return parseAmount(value) ?? new BigNumber(defaultValue)
}

// Checks if an amount is equal of nearly equal to balance within a small margin of error
// Necessary because amounts in the UI are often rounded
export function areAmountsNearlyEqual(amountInWei1: BigNumber, amountInWei2: NumberT) {
  const minValueWei = toWei(MIN_ROUNDED_VALUE)
  // Is difference btwn amount and balance less than min amount shown for token
  return amountInWei1.minus(amountInWei2).abs().lt(minValueWei)
}
