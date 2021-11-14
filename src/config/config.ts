interface Config {
  debug: boolean
  version: string | null
  url: string
  discordUrl: string
  chainId: number
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
  showPriceChart: false,
}

export const config = Object.freeze(configMainnet)
