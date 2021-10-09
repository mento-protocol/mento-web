import { Alfajores, Baklava, ContractKitProvider, Mainnet } from '@celo-tools/use-contractkit'
import '@celo-tools/use-contractkit/lib/styles.css'
import { PropsWithChildren } from 'hoist-non-react-statics/node_modules/@types/react'
import PersistWrapper from 'next-persist/lib/NextPersistWrapper'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ErrorBoundary } from 'src/app/FailScreen'
import { config } from 'src/config/config'
import { AppLayout } from 'src/layout/AppLayout'
import { logger } from 'src/utils/logger'
import store from '../app/store'
import '../styles/fonts.css'
import '../styles/globals.css'

const nextPersistConfig = {
  method: 'localStorage',
  allowList: {
    tokenPrice: ['prices'],
  },
}

// https://github.com/oslabs-beta/next-persist/issues/24
const PersistWrapperTypeFixed = PersistWrapper as any

// https://dev.to/apkoponen/how-to-disable-server-side-rendering-ssr-in-next-js-1563
function SafeHydrate({ children }: PropsWithChildren<any>) {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
}

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  const networks = getNetworkConfig()
  return (
    <ErrorBoundary>
      <SafeHydrate>
        <Provider store={store}>
          <PersistWrapperTypeFixed wrapperConfig={nextPersistConfig}>
            <ContractKitProvider
              dapp={{
                name: 'Mento',
                description: 'Mento Exchange for Celo',
                url: 'TODO',
                icon: 'TODO',
              }}
              networks={networks}
            >
              <AppLayout pathName={pathName}>
                <Component {...pageProps} />
              </AppLayout>
            </ContractKitProvider>
          </PersistWrapperTypeFixed>
        </Provider>
      </SafeHydrate>
    </ErrorBoundary>
  )
}

function getNetworkConfig() {
  const mainnet = {
    ...Mainnet,
    rpcUrl: config.jsonRpcUrlPrimary || Mainnet.rpcUrl,
    explorer: config.blockscoutUrl || Mainnet.explorer,
  }
  logger.debug('Using mainnet config:', mainnet)
  return [mainnet, Alfajores, Baklava]
}
