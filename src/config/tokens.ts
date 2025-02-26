import { ChainId } from 'src/config/chains'
import { getMentoSdk } from 'src/features/sdk'
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
  USDC = 'USDC',
  USDT = 'USDT',
  axlUSDC = 'axlUSDC',
  axlEUROC = 'axlEUROC',
  eXOF = 'eXOF',
  cKES = 'cKES',
  PUSO = 'PUSO',
  cCOP = 'cCOP',
  cGHS = 'cGHS',
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
export const USDC: Token = Object.freeze({
  id: TokenId.USDC,
  symbol: TokenId.USDC,
  name: 'USDC',
  color: Color.usdcBlue,
  decimals: 6,
})
export const USDT: Token = Object.freeze({
  id: TokenId.USDT,
  symbol: TokenId.USDT,
  name: 'USDT',
  color: Color.usdcBlue,
  decimals: 6,
})
export const axlUSDC: Token = Object.freeze({
  id: TokenId.axlUSDC,
  symbol: TokenId.axlUSDC,
  name: 'Axelar USDC',
  color: Color.usdcBlue,
  decimals: 6,
})

export const axlEUROC: Token = Object.freeze({
  id: TokenId.axlEUROC,
  symbol: TokenId.axlEUROC,
  name: 'Axelar EUROC',
  color: Color.usdcBlue, // TODO: Change to EUROC
  decimals: 6,
})
export const eXOF: Token = Object.freeze({
  id: TokenId.eXOF,
  symbol: TokenId.eXOF,
  name: 'eXOF',
  color: Color.usdcBlue,
  decimals: 18,
})
export const cKES: Token = Object.freeze({
  id: TokenId.cKES,
  symbol: TokenId.cKES,
  name: 'cKES',
  color: Color.usdcBlue,
  decimals: 18,
})

export const PUSO: Token = Object.freeze({
  id: TokenId.PUSO,
  symbol: TokenId.PUSO,
  name: 'PUSO',
  color: Color.usdcBlue,
  decimals: 18,
})

export const cCOP: Token = Object.freeze({
  id: TokenId.cCOP,
  symbol: TokenId.cCOP,
  name: 'cCOP',
  color: Color.usdcBlue,
  decimals: 18,
})

export const cGHS: Token = Object.freeze({
  id: TokenId.cGHS,
  symbol: TokenId.cGHS,
  name: 'cGHS',
  color: Color.usdcBlue,
  decimals: 18,
})

export const Tokens: Record<TokenId, Token> = {
  CELO,
  cUSD,
  cEUR,
  cREAL,
  USDC,
  USDT,
  axlUSDC,
  axlEUROC,
  eXOF,
  cKES,
  PUSO,
  cCOP,
  cGHS,
}

export const TokenAddresses: Record<ChainId, Record<TokenId, Address>> = Object.freeze({
  [ChainId.Alfajores]: {
    [TokenId.CELO]: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    [TokenId.cUSD]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    [TokenId.cEUR]: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
    [TokenId.cREAL]: '0xE4D517785D091D3c54818832dB6094bcc2744545',
    [TokenId.USDC]: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
    [TokenId.USDT]: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
    [TokenId.axlUSDC]: '0x87D61dA3d668797786D73BC674F053f87111570d',
    [TokenId.axlEUROC]: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
    [TokenId.eXOF]: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
    [TokenId.cKES]: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
    [TokenId.PUSO]: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
    [TokenId.cCOP]: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
    [TokenId.cGHS]: '0xf419dfab059c36cbafb43a088ebeb2811f9789b9',
  },
  [ChainId.Baklava]: {
    [TokenId.CELO]: '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8',
    [TokenId.cUSD]: '0x62492A644A588FD904270BeD06ad52B9abfEA1aE',
    [TokenId.cEUR]: '0xf9ecE301247aD2CE21894941830A2470f4E774ca',
    [TokenId.cREAL]: '0x6a0EEf2bed4C30Dc2CB42fe6c5f01F80f7EF16d1',
    [TokenId.USDC]: '0xB407D37d76c417B6343310D42611FCA106B2abB8',
    [TokenId.USDT]: '0x27c586469038A1749B27BF5914DAff7A14227AfB',
    [TokenId.axlUSDC]: '0xD4079B322c392D6b196f90AA4c439fC2C16d6770',
    [TokenId.axlEUROC]: '0x6f90ac394b1F45290d3023e4Ba0203005cAF2A4B',
    [TokenId.eXOF]: '0x64c1D812673E93Bc036AdC3D547d9950696DA5Af',
    [TokenId.cKES]: '0x8813Ae180017057d0Cf98C930cED1E7101B97370',
    [TokenId.PUSO]: '',
    [TokenId.cCOP]: '',
    [TokenId.cGHS]: '',
  },
  [ChainId.Celo]: {
    [TokenId.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    [TokenId.cUSD]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    [TokenId.cEUR]: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
    [TokenId.cREAL]: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
    [TokenId.USDC]: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    [TokenId.USDT]: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
    [TokenId.axlUSDC]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    [TokenId.axlEUROC]: '0x061cc5a2C863E0C1Cb404006D559dB18A34C762d',
    [TokenId.eXOF]: '0x73F93dcc49cB8A239e2032663e9475dd5ef29A08',
    [TokenId.cKES]: '0x456a3D042C0DbD3db53D5489e98dFb038553B0d0',
    [TokenId.PUSO]: '0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B',
    [TokenId.cCOP]: '0x8A567e2aE79CA692Bd748aB832081C45de4041eA',
    [TokenId.cGHS]: '0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313',
  },
})

export function isNativeToken(tokenId: string) {
  return Object.keys(Tokens).includes(tokenId)
}

export function isNativeStableToken(tokenId: string) {
  return NativeStableTokenIds.includes(tokenId as TokenId)
}

export async function isSwappable(token_1: string, token_2: string, chainId: number) {
  const sdk = await getMentoSdk(chainId)
  const tradablePairs = await sdk.getTradablePairs()
  if (!tradablePairs) return false
  if (token_1 === token_2) return false

  return tradablePairs.some(
    (assets) =>
      assets.find((asset) => asset.address === getTokenAddress(token_1 as TokenId, chainId)) &&
      assets.find((asset) => asset.address === getTokenAddress(token_2 as TokenId, chainId))
  )
}

export async function getSwappableTokenOptions(token: string, chainId: ChainId) {
  const options = getTokenOptionsByChainId(chainId)

  const swappableOptions = await Promise.all(
    options.map(async (tkn) => ({
      token: tkn,
      isSwappable: await isSwappable(tkn, token, chainId),
    }))
  ).then((results) => {
    return results
      .filter((result) => result.isSwappable && result.token !== token)
      .map((result) => result.token)
  })
  return swappableOptions
}

export function getTokenOptionsByChainId(chainId: ChainId): TokenId[] {
  const tokensForChain = TokenAddresses[chainId]

  return tokensForChain
    ? Object.entries(tokensForChain)
        .filter(([, tokenAddress]) => tokenAddress !== '') // Allows incomplete 'TokenAddresses' list i.e When tokens are not on all chains
        .map(([tokenId]) => tokenId as TokenId)
    : []
}

export function getTokenById(id: TokenId | string): Token {
  return Tokens[id as TokenId]
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
