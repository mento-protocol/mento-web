import { CeloProvider, Mainnet } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import PersistWrapper from 'next-persist/lib/NextPersistWrapper';
import type { AppProps } from 'next/app';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'src/app/FailScreen';
import { store } from 'src/app/store';
import { config } from 'src/config/config';
import { AppLayout } from 'src/layout/AppLayout';
import 'src/styles/fonts.css';
import 'src/styles/globals.css';
import { useIsSsr } from 'src/utils/ssr';
import 'src/vendor/inpage-metamask';

const dAppConfig = {
  name: 'Mento',
  description: 'Mento Exchange for Celo',
  url: config.url,
  icon: `${config.url}/logo.svg`,
};

const nextPersistConfig = {
  method: 'localStorage',
  allowList: {
    tokenPrice: ['prices'],
  },
};

// https://github.com/oslabs-beta/next-persist/issues/24
const PersistWrapperTypeFixed = PersistWrapper as any;

function SafeHydrate({ children }: PropsWithChildren<any>) {
  // Disable app SSR for now as it's not needed and
  // complicates redux integration
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  } else {
    return children;
  }
}

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname;
  return (
    <ErrorBoundary>
      <SafeHydrate>
        <Provider store={store}>
          <PersistWrapperTypeFixed wrapperConfig={nextPersistConfig}>
            <CeloProvider dapp={dAppConfig} network={Mainnet}>
              <AppLayout pathName={pathName}>
                <Component {...pageProps} />
              </AppLayout>
              <ToastContainer transition={Zoom} position={toast.POSITION.BOTTOM_RIGHT} />
            </CeloProvider>
          </PersistWrapperTypeFixed>
        </Provider>
      </SafeHydrate>
    </ErrorBoundary>
  );
}
