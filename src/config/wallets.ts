import { CeloTerminal, CeloWallet, Valora } from '@celo/rainbowkit-celo/wallets'
import type { Chain, Wallet } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  omniWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

type WalletConnector = (p: { chains: Chain[] }) => Wallet

function withLocalIconUrl(connector: WalletConnector, iconUrl: string, chains: Chain[]) {
  return { ...connector({ chains }), iconUrl }
}

export function getWalletConnectors(chains: Chain[]) {
  return [
    metaMaskWallet({ chains }),
    walletConnectWallet({ chains }),
    withLocalIconUrl(Valora, './wallets/valora.svg', chains),
    withLocalIconUrl(CeloWallet, './wallets/celo-wallet.svg', chains),
    withLocalIconUrl(CeloTerminal, './wallets/celo-terminal.svg', chains),
    omniWallet({ chains }),
    trustWallet({ chains }),
  ]
}
