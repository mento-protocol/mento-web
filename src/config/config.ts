interface Config {
  debug: boolean
  version: string | null
  url: string
  discordUrl: string
  blockscoutUrl: string
  showPriceChart: boolean
}

const isDevMode = process?.env?.NODE_ENV === 'development'
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null

export const config: Config = Object.freeze({
  debug: isDevMode,
  version,
  url: 'https://mento.finance',
  discordUrl: 'https://discord.com/invite/Zszgng9NdF',
  blockscoutUrl: 'https://explorer.celo.org',
  showPriceChart: false,
})
