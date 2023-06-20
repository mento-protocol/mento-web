import { CeloTerminal, CeloWallet, Valora } from '@celo/rainbowkit-celo/wallets'
import type { Chain, Wallet } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  omniWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

import { config } from './config'

type WalletConnector = (p: { chains: Chain[] }) => Wallet

function withLocalIconUrl(connector: WalletConnector, iconUrl: string, connectorConfig: any) {
  return { ...connector(connectorConfig), iconUrl }
}

export function getWalletConnectors(chains: Chain[]) {
  const connectorConfig = {
    chains,
    projectId: config.walletConnectProjectId,
  }

  return [
    metaMaskWallet(connectorConfig),
    walletConnectWallet(connectorConfig),
    withLocalIconUrl(Valora, './wallets/valora.svg', connectorConfig),
    withLocalIconUrl(CeloWallet, './wallets/celo-wallet.svg', connectorConfig),
    withLocalIconUrl(CeloTerminal, './wallets/celo-terminal.svg', connectorConfig),
    omniWallet(connectorConfig),
    trustWallet(connectorConfig),
  ]
}
