import { ChainId } from '@celo/react-celo'
import { Exchange } from '@mento-protocol/mento-sdk'

export const BROKER_ADDRESSES: Record<number, Address> = {
  [ChainId.Alfajores]: '',
  [ChainId.Baklava]: '0xCa7973db0D6d40b4b375510B3B5c9CB4cce16216',
  [ChainId.Mainnet]: '',
}

export const BAKLAVA_EXCHANGES: Exchange[] = [
  {
    providerAddr: '0x6596FDc6A19472ff68F751Cf84D8b3574CB4f774',
    id: '0x3135b662c38265d0655177091f1b647b4fef511103d06c016efdf18b46930d2c',
    assets: [
      '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0x6596FDc6A19472ff68F751Cf84D8b3574CB4f774',
    id: '0xb73ffc6b5123de3c8e460490543ab93a3be7d70824f1666343df49e219199b8c',
    assets: [
      '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0x6596FDc6A19472ff68F751Cf84D8b3574CB4f774',
    id: '0xed0528e42b9ecae538aab34b93813e08de03f8ac4a894b277ef193e67275bbae',
    assets: [
      '0x6a0EEf2bed4C30Dc2CB42fe6c5f01F80f7EF16d1',
      '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    ],
  },
  {
    providerAddr: '0x6596FDc6A19472ff68F751Cf84D8b3574CB4f774',
    id: '0xf77561650ba043a244ae9c58f778c141532c4afdb7cae5e6fd623b565c5584a0',
    assets: [
      '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
      '0x4c6B046750F9aBF6F0f3B511217438451bc6Aa02',
    ],
  },
]

export const MENTO_EXCHANGES: Record<number, Array<Exchange> | undefined> = {
  [ChainId.Alfajores]: undefined,
  [ChainId.Baklava]: BAKLAVA_EXCHANGES,
  [ChainId.Mainnet]: undefined,
}
