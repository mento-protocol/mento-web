import { BigNumber, BigNumberish, FixedNumber, utils } from 'ethers'
import { DISPLAY_DECIMALS, MIN_ROUNDED_VALUE, WEI_PER_UNIT } from 'src/config/consts'
import { logger } from 'src/utils/logger'

export function fromWei(value: BigNumberish | null | undefined): number {
  if (!value) return 0
  return parseFloat(utils.formatEther(value))
}

// Similar to fromWei above but rounds to set number of decimals
// with a minimum floor, configured per token
export function fromWeiRounded(
  value: BigNumberish | null | undefined,
  roundDownIfSmall = false
): string {
  if (!value) return '0'

  const minValue = FixedNumber.from(`${MIN_ROUNDED_VALUE}`) // FixedNumber throws error when given number for some reason
  const bareMinValue = FixedNumber.from(`${MIN_ROUNDED_VALUE / 5}`)

  const amount = FixedNumber.from(utils.formatEther(value))
  if (amount.isZero()) return '0'

  // If amount is less than min value
  if (amount.subUnsafe(minValue).isNegative()) {
    // If we should round and amount is really small
    if (roundDownIfSmall && amount.subUnsafe(bareMinValue).isNegative()) {
      return '0'
    }
    return minValue.toString()
  }

  return amount.round(DISPLAY_DECIMALS).toString()
}

export function toWei(value: BigNumberish | null | undefined): BigNumber {
  if (!value) return BigNumber.from(0)
  const valueString = value.toString()
  const components = valueString.split('.')
  if (components.length === 1) {
    return utils.parseEther(valueString)
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1)
    return utils.parseEther(`${components[0]}.${trimmedFraction}`)
  } else {
    throw new Error(`Cannot convert ${valueString} to wei`)
  }
}

// Take an object with an amount field and convert it to amountInWei
// Useful in converting for form <-> saga communication
export function amountFieldToWei<T extends { amount: string }>(fields: T) {
  try {
    return {
      ...fields,
      amountInWei: toWei(fields.amount).toString(),
    }
  } catch (error) {
    logger.warn('Error converting amount to wei', error)
    return {
      ...fields,
      amountInWei: '0',
    }
  }
}

// Take an object with an amountInWei field and convert it amount (in 'ether')
// Useful in converting for saga <-> form communication
export function amountFieldFromWei<T extends { amountInWei: string }>(fields: T) {
  try {
    return {
      ...fields,
      amount: fromWei(fields.amountInWei).toString(),
    }
  } catch (error) {
    logger.warn('Error converting amount from wei', error)
    return {
      ...fields,
      amount: '0',
    }
  }
}

export function fromFixidity(value: BigNumberish | null | undefined): number {
  if (!value) return 0
  return FixedNumber.from(value)
    .divUnsafe(FixedNumber.from('1000000000000000000000000'))
    .toUnsafeFloat()
}

// Strangely the Ethers BN doesn't have a min function
export function BigNumberMin(bn1: BigNumber, bn2: BigNumber) {
  return bn1.gte(bn2) ? bn2 : bn1
}
export function BigNumberMax(bn1: BigNumber, bn2: BigNumber) {
  return bn1.lte(bn2) ? bn2 : bn1
}

export function formatNumberWithCommas(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(amount)
}
