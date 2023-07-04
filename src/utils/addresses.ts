import { getAddress, isAddress } from '@ethersproject/address'
import { logger } from 'src/utils/logger'

export function isValidAddress(address: string) {
  // Need to catch because ethers' isAddress throws in some cases (bad checksum)
  try {
    const isValid = address && isAddress(address)
    return !!isValid
  } catch (error) {
    logger.warn('Invalid address', error, address)
    return false
  }
}

export function validateAddress(address: string, context: string) {
  if (!address || !isAddress(address)) {
    const errorMsg = `Invalid addresses for ${context}: ${address}`
    logger.error(errorMsg)
    throw new Error(errorMsg)
  }
}

export function normalizeAddress(address: string) {
  validateAddress(address, 'normalize')
  return getAddress(address)
}

export function shortenAddress(address: string, capitalize = true) {
  validateAddress(address, 'shorten')
  const normalizedAddress = normalizeAddress(address)

  const start = normalizedAddress.substring(0, 6)
  const end = normalizedAddress.substring(address.length - 4)

  const shortened = `${start}••••${end}`
  return capitalize ? capitalizeAddress(shortened) : shortened
}

export function capitalizeAddress(address: string) {
  return '0x' + address.substring(2).toUpperCase()
}

export function areAddressesEqual(a1: string, a2: string) {
  validateAddress(a1, 'compare')
  validateAddress(a2, 'compare')
  return getAddress(a1) === getAddress(a2)
}

export function trimLeading0x(input: string) {
  return input.startsWith('0x') ? input.substring(2) : input
}

export function ensureLeading0x(input: string) {
  return input.startsWith('0x') ? input : `0x${input}`
}
