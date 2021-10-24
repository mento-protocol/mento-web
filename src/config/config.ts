export enum CeloContract {
  Exchange = 'Exchange',
  ExchangeEUR = 'ExchangeEUR',
  GoldToken = 'GoldToken',
  SortedOracles = 'SortedOracles',
  StableToken = 'StableToken',
  StableTokenEUR = 'StableTokenEUR',
}

interface Config {
  debug: boolean
  version: string | null
  url: string
  discordUrl: string
  chainId: number
  contractAddresses: Record<CeloContract, string>
  showPriceChart: boolean
}

const isDevMode = process?.env?.NODE_ENV === 'development'
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null

const configMainnet: Config = {
  debug: isDevMode,
  version,
  url: 'https://mento.finance',
  discordUrl: 'https://discord.gg/E9AqUQnWQE',
  chainId: 42220,
  contractAddresses: {
    [CeloContract.Exchange]: '0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275',
    [CeloContract.ExchangeEUR]: '0xE383394B913d7302c49F794C7d3243c429d53D1d',
    [CeloContract.GoldToken]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    [CeloContract.SortedOracles]: '0xefB84935239dAcdecF7c5bA76d8dE40b077B7b33',
    [CeloContract.StableToken]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    [CeloContract.StableTokenEUR]: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  },
  showPriceChart: false,
}

export const config = Object.freeze(configMainnet)
