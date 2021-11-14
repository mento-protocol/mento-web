const { version } = require('./package.json')

const isDev = process.env.NODE_ENV !== 'production'

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self'${
      isDev ? " 'unsafe-eval'" : ''
    }; connect-src 'self' https://*.celo.org https://*.celo-testnet.org wss://walletconnect.celo.org wss://relay.walletconnect.org; img-src 'self' data: https://raw.githubusercontent.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; base-uri 'self'; form-action 'self'`,
  },
]

module.exports = {
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      readline: false,
    }
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }))
    return config
  },

  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  env: {
    NEXT_PUBLIC_VERSION: version,
  },
}
