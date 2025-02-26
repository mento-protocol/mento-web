import { formatUnits, parseUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import Decimal from 'decimal.js-light'
import JSBI from 'jsbi'
import { DISPLAY_DECIMALS, MIN_ROUNDED_VALUE, STANDARD_TOKEN_DECIMALS } from 'src/config/consts'
import { logger } from 'src/utils/logger'
import toFormat from 'toformat'

export type NumberT = BigNumber.Value

export function fromWei(
  value: NumberT | null | undefined,
  decimals = STANDARD_TOKEN_DECIMALS
): string {
  if (!value) return '0'
  const valueString = value.toString().trim()
  const flooredValue = new BigNumber(valueString).toFixed(0, BigNumber.ROUND_FLOOR)
  return formatUnits(flooredValue, decimals)
}

// Similar to fromWei above but rounds to set number of decimals
// with a minimum floor, configured per token
export function fromWeiRounded(
  value: NumberT | null | undefined,
  decimals = STANDARD_TOKEN_DECIMALS,
  roundDownIfSmall = true
): string {
  if (!value) return '0'
  const flooredValue = new BigNumber(value).toFixed(0, BigNumber.ROUND_FLOOR)
  const amount = new BigNumber(formatUnits(flooredValue, decimals))
  if (amount.isZero()) return '0'

  // If amount is less than min value
  if (amount.lt(MIN_ROUNDED_VALUE)) {
    if (roundDownIfSmall) return '0'
    else return MIN_ROUNDED_VALUE.toString()
  }

  return amount.toFixed(DISPLAY_DECIMALS).toString()
}

export function toWei(
  value: NumberT | null | undefined,
  decimals = STANDARD_TOKEN_DECIMALS
): BigNumber {
  if (!value) return new BigNumber(0)
  const valueString = new BigNumber(value).toFixed().trim()
  const components = valueString.split('.')
  if (components.length === 1) {
    return new BigNumber(parseUnits(valueString, decimals).toString())
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, decimals)
    return new BigNumber(parseUnits(`${components[0]}.${trimmedFraction}`, decimals).toString())
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

// Get amount that is adjusted when user input is nearly the same as max value
export function getAdjustedAmount(
  _amountInWei: BigNumber.Value,
  _maxAmount: BigNumber.Value
): BigNumber {
  const amountInWei = new BigNumber(_amountInWei)
  const maxAmount = new BigNumber(_maxAmount)
  if (areAmountsNearlyEqual(amountInWei, maxAmount)) {
    return maxAmount
  } else {
    // Just the amount entered, no adjustment needed
    return amountInWei
  }
}

export const fixed1 = new BigNumber('1000000000000000000000000')

export const toFixidity = (n: BigNumber.Value) => {
  return fixed1.times(n).integerValue(BigNumber.ROUND_FLOOR)
}

// Keeps the decimal portion
export const fromFixidity = (f: BigNumber.Value) => {
  return new BigNumber(f).div(fixed1)
}

const getDecimal = () => {
  return toFormat(Decimal)
}

export const toSignificant = (
  amount: string,
  significantDigits = 6,
  format: object = { groupSeparator: '' }
  // rounding = 0
): string => {
  const Decimal = getDecimal().set({
    precision: significantDigits + 1,
    rounding: 0,
  })

  const quotient = new Decimal(amount)

    .div(JSBI.BigInt(1).toString())
    .toSignificantDigits(significantDigits)
  return quotient.toFormat(quotient.decimalPlaces(), format)
}
