import { Exchange } from '@mento-protocol/mento-sdk'
import { ChainId } from 'src/config/chains'

export const BrokerAddresses: Record<ChainId, Address> = {
  [ChainId.Alfajores]: '0xD3Dff18E465bCa6241A244144765b4421Ac14D09',
  [ChainId.Baklava]: '0x6723749339e320E1EFcd9f1B0D997ecb45587208',
  [ChainId.Celo]: '0x777A8255cA72412f0d706dc03C9D1987306B4CaD',
}

export const AlfajoresExchanges: Exchange[] = [
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0x3135b662c38265d0655177091f1b647b4fef511103d06c016efdf18b46930d2c',
    assets: [
      '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
      '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0xb73ffc6b5123de3c8e460490543ab93a3be7d70824f1666343df49e219199b8c',
    assets: [
      '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
      '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0xed0528e42b9ecae538aab34b93813e08de03f8ac4a894b277ef193e67275bbae',
    assets: [
      '0xE4D517785D091D3c54818832dB6094bcc2744545',
      '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0xf77561650ba043a244ae9c58f778c141532c4afdb7cae5e6fd623b565c5584a0',
    assets: [
      '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
      '0x87D61dA3d668797786D73BC674F053f87111570d',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0x3e6d9109df536ba3f4c166e598bdfe132dca06573a54ca40c2b6f23ac6bd6cc6',
    assets: [
      '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
      '0x87D61dA3d668797786D73BC674F053f87111570d',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0xcfaa6be9334ee54fda94f2cfdf4c8bc376f24ce008ab9559b2a06b9fc388e78c',
    assets: [
      '0xE4D517785D091D3c54818832dB6094bcc2744545',
      '0x87D61dA3d668797786D73BC674F053f87111570d',
    ],
  },
  {
    providerAddr: '0x9B64E8EaBD1a035b148cE970d3319c5C3Ad53EC3',
    id: '0xe807b1ebe8b57ac4e5c1b8d51fcf8e3b21e919fd788bab807886c4f446a74d37',
    assets: [
      '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
      '0x6e673502c5b55F3169657C004e5797fFE5be6653',
    ],
  },
]
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
      '0xD4079B322c392D6b196f90AA4c439fC2C16d6770',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0x3e6d9109df536ba3f4c166e598bdfe132dca06573a54ca40c2b6f23ac6bd6cc6',
    assets: [
      '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
      '0xD4079B322c392D6b196f90AA4c439fC2C16d6770',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0xcfaa6be9334ee54fda94f2cfdf4c8bc376f24ce008ab9559b2a06b9fc388e78c',
    assets: [
      '0x6a0EEf2bed4C30Dc2CB42fe6c5f01F80f7EF16d1',
      '0xD4079B322c392D6b196f90AA4c439fC2C16d6770',
    ],
  },
  {
    providerAddr: '0xFF9a3da00F42839CD6D33AD7adf50bCc97B41411',
    id: '0xe807b1ebe8b57ac4e5c1b8d51fcf8e3b21e919fd788bab807886c4f446a74d37',
    assets: [
      '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
      '0x6f90ac394b1F45290d3023e4Ba0203005cAF2A4B',
    ],
  },
]
export const CeloExchanges: Exchange[] = [
  {
    providerAddr: '0x22d9db95E6Ae61c104A7B6F6C78D7993B94ec901',
    id: '0x3135b662c38265d0655177091f1b647b4fef511103d06c016efdf18b46930d2c',
    assets: [
      '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      '0x471EcE3750Da237f93B8E339c536989b8978a438',
    ],
  },
  {
    providerAddr: '0x22d9db95E6Ae61c104A7B6F6C78D7993B94ec901',
    id: '0xb73ffc6b5123de3c8e460490543ab93a3be7d70824f1666343df49e219199b8c',
    assets: [
      '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
      '0x471EcE3750Da237f93B8E339c536989b8978a438',
    ],
  },
  {
    providerAddr: '0x22d9db95E6Ae61c104A7B6F6C78D7993B94ec901',
    id: '0xed0528e42b9ecae538aab34b93813e08de03f8ac4a894b277ef193e67275bbae',
    assets: [
      '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
      '0x471EcE3750Da237f93B8E339c536989b8978a438',
    ],
  },
  {
    providerAddr: '0x22d9db95E6Ae61c104A7B6F6C78D7993B94ec901',
    id: '0x0d739efbfc30f303e8d1976c213b4040850d1af40f174f4169b846f6fd3d2f20',
    assets: [
      '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    ],
  },
]

export const MentoExchanges: Record<ChainId, Array<Exchange>> = {
  [ChainId.Alfajores]: AlfajoresExchanges,
  [ChainId.Baklava]: BaklavaExchanges,
  [ChainId.Celo]: CeloExchanges,
}
