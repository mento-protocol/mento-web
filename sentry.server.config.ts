// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'
import { IS_PROD } from 'src/middleware'

Sentry.init({
  enabled: IS_PROD,
  dsn: 'https://75592e6d2b8872d2e1c76d74c1cb8f82@o4504211835256832.ingest.us.sentry.io/4509208704712704',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
