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
