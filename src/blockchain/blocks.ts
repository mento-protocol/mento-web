import type { MiniContractKit } from '@celo/contractkit/lib/mini-kit'
import BigNumber from 'bignumber.js'
import { AVG_BLOCK_TIMES } from 'src/config/consts'
import { logger } from 'src/utils/logger'

export interface LatestBlockDetails {
  number: number
  timestamp: number
}

export async function getLatestBlockDetails(
  kit: MiniContractKit
): Promise<LatestBlockDetails | null> {
  const block = await kit.connection.web3.eth.getBlock('latest')

  if (!block || !block.number) {
    logger.warn('Latest block is not valid')
    return null
  }

  const timestamp = new BigNumber(block.timestamp).toNumber()

  return {
    number: block.number,
    timestamp,
  }
}

/**
 * Get number of blocks that would normally be mined in a given time interval
 * @param interval in seconds
 */
export function getNumBlocksPerInterval(interval: number) {
  if (!interval || interval < 0) {
    throw new Error('Invalid time interval')
  }
  return Math.floor((interval * 1000) / AVG_BLOCK_TIMES)
}
