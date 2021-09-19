import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { AppLayout } from 'src/layout/AppLayout'
import store from '../app/store'
import '../styles/globals.css'

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  return (
    <Provider store={store}>
      <AppLayout pathName={pathName}>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  )
}
