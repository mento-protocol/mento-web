import { Alfajores, Baklava, Celo } from '@celo/rainbowkit-celo/chains'
import { RainbowKitProvider, connectorsForWallets, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from 'src/components/Errors'
import { getWalletConnectors } from 'src/config/wallets'
import { store } from 'src/features/store/store'
import { AppLayout } from 'src/layout/AppLayout'
import { Color } from 'src/styles/Color'
import 'src/styles/fonts.css'
import 'src/styles/globals.css'
import { useIsSsr } from 'src/utils/ssr'
import 'src/vendor/inpage-metamask'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const reactQueryClient = new QueryClient({})

const { chains, provider } = configureChains(
  [Celo, Alfajores, Baklava],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }) })]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended for Celo chains',
    wallets: getWalletConnectors(chains),
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
})

function SafeHydrate({ children }: PropsWithChildren<any>) {
  // Disable app SSR for now as it's not needed and
  // complicates redux and wagmi integration
  const isSsr = useIsSsr()
  if (isSsr) {
    return <div></div>
  } else {
    return children
  }
}

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  return (
    <ErrorBoundary>
      <SafeHydrate>
        <Provider store={store}>
          <QueryClientProvider client={reactQueryClient}>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider
                chains={chains}
                theme={lightTheme({
                  accentColor: Color.mentoGreen600,
                  borderRadius: 'small',
                  fontStack: 'system',
                })}
              >
                <AppLayout pathName={pathName}>
                  <Component {...pageProps} />
                </AppLayout>
                <ToastContainer
                  transition={Zoom}
                  position={toast.POSITION.BOTTOM_RIGHT}
                  limit={2}
                />
              </RainbowKitProvider>
            </WagmiConfig>
          </QueryClientProvider>
        </Provider>
      </SafeHydrate>
      <Analytics />
    </ErrorBoundary>
  )
}
