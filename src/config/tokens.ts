import { ChainId } from 'src/config/chains'
import { MentoExchanges } from 'src/config/exchanges'
import { Color } from 'src/styles/Color'
import { areAddressesEqual } from 'src/utils/addresses'

export interface Token {
  id: string
  symbol: string // The same as id for now
  name: string
  color: string
  decimals: number
}

export interface TokenWithAddress {
  address: Address
}

export enum TokenId {
  CELO = 'CELO',
  cUSD = 'cUSD',
  cEUR = 'cEUR',
  cREAL = 'cREAL',
  axlUSDC = 'axlUSDC',
  axlEUROC = 'axlEUROC',
  eXOF = 'eXOF',
}

export const NativeStableTokenIds = [TokenId.cUSD, TokenId.cEUR, TokenId.cREAL]

export const USDCVariantIds = [TokenId.axlUSDC]

export const CELO: Token = Object.freeze({
  id: TokenId.CELO,
  symbol: TokenId.CELO,
  name: 'Celo Native',
  color: Color.celoGold,
  decimals: 18,
})
export const cUSD: Token = Object.freeze({
  id: TokenId.cUSD,
  symbol: TokenId.cUSD,
  name: 'Celo Dollar',
  color: Color.celoGreen,
  decimals: 18,
})
export const cEUR: Token = Object.freeze({
  id: TokenId.cEUR,
  symbol: TokenId.cEUR,
  name: 'Celo Euro',
  color: Color.celoGreen,
  decimals: 18,
})
export const cREAL: Token = Object.freeze({
  id: TokenId.cREAL,
  symbol: TokenId.cREAL,
  name: 'Celo Real',
  color: Color.celoGreen,
  decimals: 18,
})
export const axlUSDC: Token = Object.freeze({
  id: TokenId.axlUSDC,
  symbol: TokenId.axlUSDC,
  name: 'Axelar USDC',
  color: Color.usdcBlue,
  decimals: 6,
})

// TODO: Doulbe check
export const axlEUROC: Token = Object.freeze({
  id: TokenId.axlEUROC, // TODO: Change to EUROC
  symbol: TokenId.axlEUROC, // TODO: Change to EUROC
  name: 'Axelar EUROC',
  color: Color.usdcBlue, // TODO: Change to EUROC
  decimals: 6,
})

export const eXOF: Token = Object.freeze({
  id: TokenId.eXOF, // TODO: Change to eXOF
  symbol: TokenId.eXOF, // TODO: Change to eXOF
  name: 'West African Franc',
  color: Color.usdcBlue, // TODO: Change to eXOF
  decimals: 6, // TODO: Change to eXOF
})

export const Tokens: Record<TokenId, Token> = {
  CELO,
  cUSD,
  cEUR,
  cREAL,
  axlUSDC,
  axlEUROC,
  eXOF,
}

export const TokenAddresses: Record<ChainId, Record<TokenId, Address>> = Object.freeze({
  [ChainId.Alfajores]: {
    [TokenId.CELO]: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    [TokenId.cUSD]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    [TokenId.cEUR]: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
    [TokenId.cREAL]: '0xE4D517785D091D3c54818832dB6094bcc2744545',
    [TokenId.axlUSDC]: '0x87D61dA3d668797786D73BC674F053f87111570d',
    [TokenId.axlEUROC]: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
    [TokenId.eXOF]: '',
  },
  [ChainId.Baklava]: {
    [TokenId.CELO]: '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    [TokenId.cUSD]: '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
    [TokenId.cEUR]: '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
    [TokenId.cREAL]: '0x6a0EEf2bed4C30Dc2CB42fe6c5f01F80f7EF16d1',
    [TokenId.axlUSDC]: '0xD4079B322c392D6b196f90AA4c439fC2C16d6770',
    [TokenId.axlEUROC]: '0x6f90ac394b1F45290d3023e4Ba0203005cAF2A4B',
    [TokenId.eXOF]: '',
  },
  [ChainId.Celo]: {
    [TokenId.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    [TokenId.cUSD]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    [TokenId.cEUR]: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
    [TokenId.cREAL]: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
    [TokenId.axlUSDC]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    [TokenId.axlEUROC]: '',
    [TokenId.eXOF]: '',
  },
})

export function isUSDCVariant(tokenId: string) {
  return USDCVariantIds.includes(tokenId as TokenId)
}

export function isNativeToken(tokenId: string) {
  return Object.keys(Tokens).includes(tokenId)
}

export function isNativeStableToken(tokenId: string) {
  return NativeStableTokenIds.includes(tokenId as TokenId)
}

export function isSwappable(token_1: string, token_2: string, chainId: ChainId) {
  const exchanges = MentoExchanges[chainId]

  if (!exchanges) return false

  if (token_1 === token_2) return false

  return exchanges.some(
    (obj) =>
      obj.assets.includes(getTokenAddress(token_1 as TokenId, chainId)) &&
      obj.assets.includes(getTokenAddress(token_2 as TokenId, chainId))
  )
}

export function getSwappableTokenOptions(token: string, chainId: ChainId) {
  return getTokenOptionsByChainId(chainId)
    .filter((tkn) => isSwappable(tkn, token, chainId))
    .filter((tkn) => token !== tkn)
}

export function getTokenOptionsByChainId(chainId: ChainId): TokenId[] {
  const tokensForChain = TokenAddresses[chainId]

  return tokensForChain
    ? Object.entries(tokensForChain)
        .filter(([, tokenAddress]) => tokenAddress !== '') // Allows incomplete 'TokenAddresses' list i.e When tokens are not on all chains
        .map(([tokenId]) => tokenId as TokenId)
    : []
}

export function getTokenById(id: string): Token | null {
  return Tokens[id as TokenId] || null
}

export function getTokenAddress(id: TokenId, chainId: ChainId): Address {
  const addr = TokenAddresses[chainId][id]
  if (!addr) throw new Error(`No address found for token ${id} on chain ${chainId}`)
  return addr
}

export function getTokenByAddress(address: Address): Token {
  const idAddressTuples = Object.values(TokenAddresses)
    .map((idToAddress) => Object.entries(idToAddress))
    .flat()
  // This assumes no clashes btwn different tokens on diff chains
  for (const [id, tokenAddr] of idAddressTuples) {
    if (areAddressesEqual(address, tokenAddr)) {
      return Tokens[id as TokenId]
    }
  }
  throw new Error(`No token found for address ${address}`)
}
