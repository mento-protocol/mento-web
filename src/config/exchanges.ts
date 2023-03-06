import { Exchange } from '@mento-protocol/mento-sdk'

import { ChainId } from './chains'

export const BrokerAddresses: Record<ChainId, Address> = {
  [ChainId.Alfajores]: '',
  [ChainId.Baklava]: '0x6723749339e320E1EFcd9f1B0D997ecb45587208',
  [ChainId.Celo]: '',
}

export const BaklavaExchanges: Exchange[] = [
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0x3135b662c38265d0655177091f1b647b4fef511103d06c016efdf18b46930d2c',
    assets: [
      '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0xb73ffc6b5123de3c8e460490543ab93a3be7d70824f1666343df49e219199b8c',
    assets: [
      '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0xed0528e42b9ecae538aab34b93813e08de03f8ac4a894b277ef193e67275bbae',
    assets: [
      '0x6a0EEf2bed4C30Dc2CB42fe6c5f01F80f7EF16d1',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0xf77561650ba043a244ae9c58f778c141532c4afdb7cae5e6fd623b565c5584a0',
    assets: [
      '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
      '0x4c6B046750F9aBF6F0f3B511217438451bc6Aa02',
    ],
  },
]

export const MentoExchanges: Record<ChainId, Array<Exchange> | undefined> = {
  [ChainId.Alfajores]: undefined,
  [ChainId.Baklava]: BaklavaExchanges,
  [ChainId.Celo]: undefined,
}
