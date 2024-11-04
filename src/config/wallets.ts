import type { Chain } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  omniWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { Valora } from 'src/config/celoWallets'
import { config } from 'src/config/config'

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
  ]
}

/**
 * Remove wallet sessions older than 1 hour
 * @dev We got into an issue where the walletconnect data was in a corrupted state
 *      and causing issues with wallet connection. This will remove the data from localStorage to clean up the state.
 */
export const cleanupStaleWalletSessions = () => {
  const wcStorageKeys = Object.keys(localStorage).filter(
    (key) => key.startsWith('wc@') || key.startsWith('walletconnect')
  )

  wcStorageKeys.forEach((key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return
      const data = JSON.parse(item)
      const timestamp = data?.lastUpdated || data?.timestamp

      // Remove sessions older than 1 hour
      if (timestamp && Date.now() - timestamp > 60 * 60 * 1000) {
        localStorage.removeItem(key)
      }
    } catch {
      // Just in case, remove the item if it's corrupted
      localStorage.removeItem(key)
    }
  })
}
