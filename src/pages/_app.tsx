import { CeloProvider } from '@celo/react-celo'
import '@celo/react-celo/lib/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from 'src/components/Errors'
import { config } from 'src/config/config'
import { store } from 'src/features/store/store'
import { AppLayout } from 'src/layout/AppLayout'
import 'src/styles/fonts.css'
import 'src/styles/globals.css'
import { useIsSsr } from 'src/utils/ssr'
import 'src/vendor/inpage-metamask'

const dAppConfig = {
  name: 'Mento',
  description: 'Mento Exchange for Celo',
  url: config.url,
  icon: `${config.url}/glyph.png`,
  walletConnectProjectId: config.walletConnectProjectId,
}

const reactQueryClient = new QueryClient({})

function SafeHydrate({ children }: PropsWithChildren<any>) {
  // Disable app SSR for now as it's not needed and
  // complicates redux integration
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
            <CeloProvider dapp={dAppConfig} defaultNetwork="Baklava">
              <AppLayout pathName={pathName}>
                <Component {...pageProps} />
              </AppLayout>
              <ToastContainer transition={Zoom} position={toast.POSITION.BOTTOM_RIGHT} limit={2} />
            </CeloProvider>
          </QueryClientProvider>
        </Provider>
      </SafeHydrate>
    </ErrorBoundary>
  )
}
