import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getDarkMode } from 'src/styles/mediaQueries'

class MyDocument extends Document {
  render() {
    const isDarkMode = getDarkMode()
    return (
      <Html className={isDarkMode ? 'dark' : ''}>
        <Head>
          <meta charSet="utf-8" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#19d88a" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#19d88a" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="application-name" content="Mento Stable Exchange" />
          <meta name="keywords" content="Mento Stable Exchange Finance Celo cUSD cEUR cREAL" />
          <meta name="description" content="Simple exchanges of Mento sustainable stable assets" />

          <meta name="HandheldFriendly" content="true" />
          <meta name="apple-mobile-web-app-title" content="Mento Stable Exchange" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta property="og:url" content="https://mento.finance" />
          <meta property="og:title" content="Mento Stable Exchange" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://mento.finance/logo-color.png" />
          <meta
            property="og:description"
            content="Simple exchanges of Mento sustainable stable assets"
          />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Mento Stable Exchange" />
          <meta
            name="twitter:description"
            content="Simple exchanges of Mento sustainable stable assets"
          />
          <meta name="twitter:image" content="https://mento.finance/logo-color.png" />
        </Head>
        <body className="text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
