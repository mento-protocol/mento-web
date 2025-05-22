import type { Chain } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { Valora } from 'src/config/celoWallets'
import { config } from 'src/config/config'
import { logger } from 'src/utils/logger'

export function getWalletConnectors(chains: Chain[]) {
  const connectorConfig = {
    chains,
    projectId: config.walletConnectProjectId,
  }

  return [
    metaMaskWallet(connectorConfig),
    walletConnectWallet(connectorConfig),
    Valora(connectorConfig),
    // CeloTerminal(connectorConfig),
    // CeloWallet(connectorConfig),
    omniWallet(connectorConfig),
    trustWallet(connectorConfig),
    rainbowWallet(connectorConfig),
  ]
}

/**
 * Remove wallet connect local storage data
 * @dev We got into an issue where the walletconnect data was in a corrupted state
 *      and causing issues with wallet connection. This will remove the data from
 *      localStorage to clean up the state.
 */
export const cleanupStaleWalletSessions = () => {
  logger.debug('Clearing wallet connect local storage data')
  const wcStorageKeys = Object.keys(localStorage).filter(
    (key) => key.startsWith('wc@') || key.startsWith('walletconnect')
  )

  logger.debug(`Found ${wcStorageKeys.length} wallet connect keys`)

  wcStorageKeys.forEach((key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return

      localStorage.removeItem(key)
      logger.debug(`Removed wallet connect value for key: ${key}`)
    } catch (error) {
      logger.error(`Failed to remove wallet connect value for key: ${key}`, error)
    }
  })
}
