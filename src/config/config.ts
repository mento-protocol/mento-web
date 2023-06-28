interface Config {
  debug: boolean
  version: string | null
  showPriceChart: boolean
  walletConnectProjectId: string
}

const isDevMode = process?.env?.NODE_ENV === 'development'
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null
const walletConnectProjectId = process?.env?.NEXT_PUBLIC_WALLET_CONNECT_ID || ''

export const config: Config = Object.freeze({
  debug: isDevMode,
  version,
  showPriceChart: false,
  walletConnectProjectId,
})
