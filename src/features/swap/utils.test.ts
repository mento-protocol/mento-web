import { BigNumber, ethers } from 'ethers'
import { TokenId } from 'src/config/tokens'
import {
  calcExchangeRate,
  getMaxSellAmount,
  getMinBuyAmount,
  parseInputExchangeAmount,
} from 'src/features/swap/utils'

const ONE_ETH_WEI = ethers.constants.WeiPerEther.toString()

describe('swap utilities', () => {
  describe('parseInputExchangeAmount', () => {
    it('Parses wei amount', () => {
      expect(parseInputExchangeAmount(ONE_ETH_WEI, TokenId.CELO, true).toString()).toEqual(
        ONE_ETH_WEI
      )
    })
    it('Parses ether amount', () => {
      expect(parseInputExchangeAmount('12.345', TokenId.CELO, false).toString()).toEqual(
        '12345000000000000000'
      )
    })
    it('Falls back to 0', () => {
      expect(parseInputExchangeAmount('invalid', TokenId.CELO, true).toString()).toEqual('0')
    })
  })

  describe('getMinBuyAmount', () => {
    it('Computes min buy for small slippage', () => {
      expect(getMinBuyAmount(ONE_ETH_WEI, 0.5).toString()).toEqual('995000000000000000')
    })
    it('Computes min buy for no slippage', () => {
      expect(getMinBuyAmount(ONE_ETH_WEI, 0).toString()).toEqual(ONE_ETH_WEI)
    })
  })

  describe('getMaxSellAmount', () => {
    it('Computes max sell for small slippage', () => {
      expect(getMaxSellAmount(ONE_ETH_WEI, 0.5).toString()).toEqual('1005000000000000000')
    })
    it('Computes  max sell for no slippage', () => {
      expect(getMaxSellAmount(ONE_ETH_WEI, 0).toString()).toEqual(ONE_ETH_WEI)
    })
  })

  describe('calcExchangeRate', () => {
    it('Calculates rate for tokens with equal decimals', () => {
      expect(
        calcExchangeRate(
          ONE_ETH_WEI,
          18,
          BigNumber.from(ethers.constants.WeiPerEther).div(2).toString(),
          18
        )
      ).toEqual('2.0000')
    })
    it('Calculates rate for tokens with different decimals', () => {
      expect(calcExchangeRate(ONE_ETH_WEI, 18, ONE_ETH_WEI, 17)).toEqual('0.1000')
    })
    it('Rounds correctly', () => {
      expect(calcExchangeRate(100000, 18, 100000, 6)).toEqual('0.0000')
    })
  })
})
