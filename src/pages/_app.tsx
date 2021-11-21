import { ContractKitProvider, Mainnet } from '@celo-tools/use-contractkit'
import '@celo-tools/use-contractkit/lib/styles.css'
import PersistWrapper from 'next-persist/lib/NextPersistWrapper'
import type { AppProps } from 'next/app'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorBoundary } from 'src/app/FailScreen'
import { store } from 'src/app/store'
import { config } from 'src/config/config'
import { AppLayout } from 'src/layout/AppLayout'
import 'src/styles/fonts.css'
import 'src/styles/globals.css'
import 'src/vendor/inpage-metamask'

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
  return (
    <ErrorBoundary>
      <SafeHydrate>
        <Provider store={store}>
          <PersistWrapperTypeFixed wrapperConfig={nextPersistConfig}>
            <ContractKitProvider
              dapp={{
                name: 'Mento',
                description: 'Mento Exchange for Celo',
                url: config.url,
                icon: `${config.url}/logo.svg`,
              }}
              network={Mainnet}
            >
              <AppLayout pathName={pathName}>
                <Component {...pageProps} />
              </AppLayout>
              <ToastContainer transition={Zoom} position={toast.POSITION.BOTTOM_RIGHT} />
            </ContractKitProvider>
          </PersistWrapperTypeFixed>
        </Provider>
      </SafeHydrate>
    </ErrorBoundary>
  )
}
