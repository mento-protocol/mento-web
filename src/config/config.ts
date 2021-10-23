export enum CeloContract {
  Exchange = 'Exchange',
  ExchangeEUR = 'ExchangeEUR',
  GasPriceMinimum = 'GasPriceMinimum',
  GoldToken = 'GoldToken',
  SortedOracles = 'SortedOracles',
  StableToken = 'StableToken',
  StableTokenEUR = 'StableTokenEUR',
}

interface Config {
  debug: boolean
  version: string | null
  url: string
  jsonRpcUrlPrimary?: string
  blockscoutUrl?: string
  walletConnectRelay?: string
  chainId: number
  contractAddresses: Record<CeloContract, string>
  showPriceChart: boolean
}

const isDevMode = process?.env?.NODE_ENV === 'development'
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configMainnet: Config = {
  debug: isDevMode,
  version,
  url: 'https://mento.finance',
  jsonRpcUrlPrimary: 'https://node.celowallet.app',
  blockscoutUrl: 'https://explorer.celo.org',
  walletConnectRelay: 'wss://walletconnect.celo.org',
  chainId: 42220,
  contractAddresses: {
    [CeloContract.Exchange]: '0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275',
    [CeloContract.ExchangeEUR]: '0xE383394B913d7302c49F794C7d3243c429d53D1d',
    [CeloContract.GasPriceMinimum]: '0xDfca3a8d7699D8bAfe656823AD60C17cb8270ECC',
    [CeloContract.GoldToken]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    [CeloContract.SortedOracles]: '0xefB84935239dAcdecF7c5bA76d8dE40b077B7b33',
    [CeloContract.StableToken]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    [CeloContract.StableTokenEUR]: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  },
  showPriceChart: false,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configAlfajores: Config = {
  debug: true,
  version,
  url: 'https://mento.finance',
  jsonRpcUrlPrimary: 'https://alfajores-forno.celo-testnet.org',
  blockscoutUrl: 'https://alfajores-blockscout.celo-testnet.org',
  walletConnectRelay: 'wss://walletconnect.celo-networks-dev.org',
  chainId: 44787,
  contractAddresses: {
    [CeloContract.Exchange]: '0x17bc3304F94c85618c46d0888aA937148007bD3C',
    [CeloContract.ExchangeEUR]: '0x997B494F17D3c49E66Fafb50F37A972d8Db9325B',
    [CeloContract.GasPriceMinimum]: '0xd0Bf87a5936ee17014a057143a494Dc5C5d51E5e',
    [CeloContract.GoldToken]: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    [CeloContract.SortedOracles]: '0xFdd8bD58115FfBf04e47411c1d228eCC45E93075',
    [CeloContract.StableToken]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    [CeloContract.StableTokenEUR]: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
  },
  showPriceChart: false,
}

export const config = Object.freeze(configMainnet)
