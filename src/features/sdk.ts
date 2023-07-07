import { Mento } from '@mento-protocol/mento-sdk'
import { ChainId } from 'src/config/chains'
import { BrokerAddresses, MentoExchanges } from 'src/config/exchanges'
import { getProvider } from 'src/features/providers'

const cache: Record<number, Mento> = {}

export async function getMentoSdk(chainId: ChainId): Promise<Mento> {
  if (cache[chainId]) return cache[chainId]

  const provider = getProvider(chainId)
  const brokerAddr = BrokerAddresses[chainId]
  const exchanges = MentoExchanges[chainId]
  let mento: Mento
  if (brokerAddr) {
    mento = await Mento.createWithParams(provider, brokerAddr, exchanges)
  } else {
    mento = await Mento.create(provider)
  }
  cache[chainId] = mento
  return mento
}
