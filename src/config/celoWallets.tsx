// Copied from https://github.com/celo-org/rainbowkit-celo/blob/a1b547840cedb48839fd8d0d72c81d9763c1f84c/packages/rainbowkit-celo/wallets/*
// and modified to fix support for WalletConnect v2
import { Alfajores, Baklava, Celo } from '@celo/rainbowkit-celo/chains'
import type { Chain, Wallet } from '@rainbow-me/rainbowkit'
import { getWalletConnectConnector } from '@rainbow-me/rainbowkit'
import { toast } from 'react-toastify'
import { tryClipboardSet } from 'src/utils/clipboard'
import { WalletConnectConnector } from 'wagmi/dist/connectors/walletConnect'

async function getWalletConnectUri(connector: WalletConnectConnector): Promise<string> {
  const provider = await connector.getProvider()
  return new Promise((resolve) => provider.once('display_uri', resolve))
}

// rainbowkit utils has it but doesn't export it :/
function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

interface WalletOptions {
  chains: Chain[]
  projectId: string
}

export const Valora = ({
  chains = [Alfajores, Baklava, Celo],
  projectId,
}: WalletOptions): Wallet => ({
  id: 'valora',
  name: 'Valora',
  iconUrl: 'https://registry.walletconnect.com/api/v1/logo/md/d01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974',
  iconBackground: '#FFF',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=co.clabs.valora',
    ios: 'https://apps.apple.com/app/id1520414263?mt=8',
    qrCode: 'https://valoraapp.com/',
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
      projectId,
    })
    return {
      connector,
      mobile: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector)
          return isAndroid()
            ? uri
            : // ideally this would use the WalletConnect registry, but this will do for now
              `celo://wallet/wc?uri=${encodeURIComponent(uri)}`
        },
      },
      qrCode: {
        getUri: () => getWalletConnectUri(connector),
        instructions: {
          learnMoreUrl: 'https://valoraapp.com/learn',
          steps: [
            {
              description:
                'The crypto wallet to buy, send, spend, earn, and collect NFTs on the Celo blockchain.',
              step: 'install',
              title: 'Open the Valora app',
            },
            {
              description:
                'After you scan, a connection prompt will appear for you to connect your wallet.',
              step: 'scan',
              title: 'Tap the scan button',
            },
          ],
        },
      },
    }
  },
})

export const CeloTerminal = ({
  chains = [Alfajores, Baklava, Celo],
  projectId,
}: WalletOptions): Wallet => ({
  id: 'celo-terminal',
  name: 'Celo Terminal',
  iconUrl: './wallets/celo-terminal.svg',
  iconBackground: '#FFF',
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
      projectId,
    })

    return {
      connector,
      qrCode: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector)
          await tryClipboardSet(uri)
          toast.success('WalletConnect URL copied to clipboard')
          return uri
        },
      },
    }
  },
})

export const CeloWallet = ({
  chains = [Alfajores, Baklava, Celo],
  projectId,
}: WalletOptions): Wallet => ({
  id: 'celo-wallet',
  name: 'Celo Wallet',
  iconUrl: './wallets/celo-wallet.svg',
  iconBackground: '#FFF',
  createConnector: () => {
    const connector = getWalletConnectConnector({
      chains,
      projectId,
    })

    return {
      connector,
      mobile: {
        getUri: () => getWalletConnectUri(connector),
      },
      desktop: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector)
          await tryClipboardSet(uri)
          toast.success('WalletConnect URL copied to clipboard')
          return `celowallet://wc?uri=${encodeURIComponent(uri)}`
        },
      },
    }
  },
})
