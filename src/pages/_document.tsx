import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#35d07f" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="application-name" content="Mento Fi" />
          <meta name="keywords" content="Mento Finance Celo Exchange cUSD cEUR cREAL" />
          <meta name="description" content="A simple DApp for Celo Mento exchanges." />

          <meta name="HandheldFriendly" content="true" />
          <meta name="apple-mobile-web-app-title" content="Mento Fi" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta property="og:url" content="https://mento.finance" />
          <meta property="og:title" content="Mento Fi" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://mento.finance/celo-hero.jpg" />
          <meta property="og:description" content="A simple DApp for Celo Mento exchanges." />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Mento Fi" />
          <meta name="twitter:description" content="A simple DApp for Celo Mento exchanges." />
          <meta name="twitter:image" content="https://mento.finance/celo-hero.jpg" />
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
