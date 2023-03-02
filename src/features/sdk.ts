import { Mento } from '@mento-protocol/mento-sdk'
import { BROKER_ADDRESSES, MENTO_EXCHANGES } from 'src/config/exchanges'

import { getProvider } from './providers'

const cache: Record<number, Mento> = {}

export async function getMentoSdk(chainId: number) {
  if (cache[chainId]) return cache[chainId]

  const provider = getProvider(chainId)
  const brokerAddr = BROKER_ADDRESSES[chainId]
  const exchanges = MENTO_EXCHANGES[chainId]
  let mento: Mento
  if (brokerAddr) {
    mento = await Mento.createWithParams(provider, brokerAddr, exchanges)
  } else {
    mento = await Mento.create(provider)
  }
  cache[chainId] = mento
  return mento
}
