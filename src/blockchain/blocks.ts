import { AVG_BLOCK_TIMES } from 'src/config/consts'
import { logger } from 'src/utils/logger'

export interface LatestBlockDetails {
  nodeUrl: string
  number: number
  timestamp: number
}

//TODO
const provider = {
  connection: {
    url: 'foobar',
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBlock: (s: any) => ({ number: 9125760, timestamp: 1633205701023 }),
}

export async function getLatestBlockDetails(): Promise<LatestBlockDetails | null> {
  const nodeUrl = provider.connection?.url
  const block = await provider.getBlock('latest')
  if (!block || !block.number) {
    logger.warn('Latest block is not valid')
    return null
  }

  return {
    nodeUrl,
    number: block.number,
    timestamp: block.timestamp,
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
