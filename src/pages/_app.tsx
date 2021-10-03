import { ContractKitProvider } from '@celo-tools/use-contractkit'
import '@celo-tools/use-contractkit/lib/styles.css'
import PersistWrapper from 'next-persist/lib/NextPersistWrapper'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { AppLayout } from 'src/layout/AppLayout'
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

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  return (
    <Provider store={store}>
      <PersistWrapperTypeFixed wrapperConfig={nextPersistConfig}>
        <ContractKitProvider
          dapp={{
            name: 'Mento',
            description: 'Mento Exchange for Celo',
            url: 'TODO',
            icon: 'TODO',
          }}
        >
          <AppLayout pathName={pathName}>
            <Component {...pageProps} />
          </AppLayout>
        </ContractKitProvider>
      </PersistWrapperTypeFixed>
    </Provider>
  )
}
