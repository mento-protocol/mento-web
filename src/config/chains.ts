export enum ChainId {
  Alfajores = 44787,
  Baklava = 62320,
  Celo = 42220,
}

export interface ChainMetadata {
  chainId: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  explorerApiUrl: string
}

export const Alfajores: ChainMetadata = {
  chainId: ChainId.Alfajores,
  name: 'Alfajores',
  rpcUrl: 'https://alfajores-forno.celo-testnet.org',
  explorerUrl: 'https://alfajores.celoscan.io',
  explorerApiUrl: 'https://api-alfajores.celoscan.io/api',
}

export const Baklava: ChainMetadata = {
  chainId: ChainId.Baklava,
  name: 'Baklava',
  rpcUrl: 'https://baklava-forno.celo-testnet.org',
  explorerUrl: 'https://explorer.celo.org/baklava',
  explorerApiUrl: 'https://explorer.celo.org/baklava/api',
}

export const Celo: ChainMetadata = {
  chainId: ChainId.Celo,
  name: 'Celo',
  rpcUrl: 'https://forno.celo.org',
  explorerUrl: 'https://celoscan.io',
  explorerApiUrl: 'https://api.celoscan.io/api',
}

export const chainIdToChain: Record<number, ChainMetadata> = {
  [ChainId.Alfajores]: Alfajores,
  [ChainId.Baklava]: Baklava,
  [ChainId.Celo]: Celo,
}

export const allChains = [Celo, Alfajores, Baklava]
