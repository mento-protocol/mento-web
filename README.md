# Mento Web App

This is the home for the Mento web app!

This DApp lets users make exchanges between Celo's native currencies using the Mento on-chain exchange mechanism.

For more details about how Mento works, see the [documentation](https://docs.mento.org)

## Architecture

This project uses Next.JS, React, Redux, Tailwind, Wagmi, and RainbowKit.

## Run Locally

1. Install deps: `yarn`
1. Create a local `.env` from the example: `cp .env.example .env`
1. Start server: `yarn dev`
1. `open http://localhost:3000`

## Deploy

- Deployments happen automatically via Vercel's Github app.
- Every push into `main` is automatically deployed to app.mento.org
- Deployment configuration can be changed by Mento Labs Team Members at <https://vercel.com/mentolabs/mento-web>

## Contribute

For small contributions such as bug fixes or style tweaks, please open a Pull Request.
For new features, please create an issue to start a discussion on [Discord](https://discord.com/invite/Zszgng9NdF).

## License

This project is [Apache 2.0 Licensed](LICENSE).
