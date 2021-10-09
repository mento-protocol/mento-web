import { useContractKit } from '@celo-tools/use-contractkit'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { NativeTokenId, NativeTokens } from 'src/config/tokens'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { getExchangeContract, getTokenContract } from 'src/features/swap/contracts'
import { fetchExchangeRates } from 'src/features/swap/fetchExchangeRates'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import { useExchangeValues } from 'src/features/swap/utils'
import LeftArrow from 'src/images/icons/arrow-left-circle.svg'
import RepeatArrow from 'src/images/icons/arrow-repeat.svg'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Color } from 'src/styles/Color'
import { toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirm(props: Props) {
  const { fromAmount, fromTokenId, toTokenId, slippage } = props.formValues
  const toCeloRates = useAppSelector((s) => s.swap.toCeloRates)
  const dispatch = useAppDispatch()
  const { address, kit, initialised, performActions } = useContractKit()

  // Ensure invariants are met, otherwise return to swap form
  const isConfirmValid = fromAmount && fromTokenId && toTokenId && address && kit
  useEffect(() => {
    if (!isConfirmValid) {
      dispatch(setFormValues(null))
    }
  }, [isConfirmValid, dispatch])

  const { from, to, rate, stableTokenId } = useExchangeValues(
    fromAmount,
    fromTokenId,
    toTokenId,
    toCeloRates
  )
  const fromToken = NativeTokens[fromTokenId]
  const toToken = NativeTokens[toTokenId]

  const onSubmit = async () => {
    if (!address || !kit) return
    try {
      await performActions(async (k) => {
        const stableTokenId = fromTokenId === NativeTokenId.CELO ? toTokenId : fromTokenId
        const sellGold = fromTokenId === NativeTokenId.CELO
        const amountInWei = toWei(fromAmount)
        // TODO adjust amount based on balance
        // TODO actual minBuyAmount
        // TODO test throwing error in here
        const minBuyAmount = new BigNumber(amountInWei).multipliedBy(4)

        const tokenContract = await getTokenContract(k, fromTokenId)
        const exchangeContract = await getExchangeContract(k, stableTokenId)

        const approveTx = await tokenContract.increaseAllowance(
          exchangeContract.address,
          amountInWei
        )
        const approveReceipt = await approveTx.sendAndWaitForReceipt()
        logger.info(`Tx receipt received for approval: ${approveReceipt.transactionHash}`)

        const exchangeTx = await exchangeContract.sell(amountInWei, minBuyAmount, sellGold)
        const exchangeReceipt = await exchangeTx.sendAndWaitForReceipt()
        logger.info(`Tx receipt received for swap: ${exchangeReceipt.transactionHash}`)
        // TODO getconenctedkit here and throughout before using thunks?
        await dispatch(fetchBalances({ address, kit: k }))
      })
    } catch (e) {
      // TODO surface error
      logger.error(e)
    }
  }

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  const onClickRefresh = () => {
    if (!kit || !initialised) return
    dispatch(fetchExchangeRates({ kit })).catch((err) => {
      // TODO surface error
      logger.error('Failed to retrieve exchange rates', err)
    })
  }

  return (
    <FloatingBox width="w-96">
      <div className="flex justify-between">
        <IconButton
          imgSrc={LeftArrow}
          width={26}
          height={26}
          title="Go back"
          onClick={onClickBack}
        />
        <h2 className="text-lg font-medium">Confirm Swap</h2>
        <IconButton
          imgSrc={RepeatArrow}
          width={24}
          height={24}
          title="Refresh Rates"
          onClick={onClickRefresh}
        />
      </div>
      <div className="mt-6 bg-greengray-lightest rounded-md">
        <div className="relative flex items-center justify-between">
          <div className="flex flex-1 items-center px-2.5 py-2.5 border-r border-gray-400">
            <TokenIcon size="l" token={fromToken} />
            <div className="flex flex-col flex-1 items-center px-2">
              <div className="text-sm text-center">{fromToken.symbol}</div>
              <div className="text-lg text-center font-mono leading-6">{from.amount}</div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end px-2.5 py-2">
            <div className="flex flex-col flex-1 items-center px-2">
              <div className="text-sm text-center">{toToken.symbol}</div>
              <div className="text-lg text-center font-mono leading-6">{to.amount}</div>
            </div>
            <TokenIcon size="l" token={toToken} />
          </div>
          <div
            style={{ top: '42%' }}
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4"
          >
            <RightCircleArrow />
          </div>
        </div>
        <div className="flex items-end justify-center">
          <div className="py-0.5 px-3 border border-b-0 border-black50 text-black50 text-sm rounded-t">
            {rate.isReady ? `${rate.fromCeloValue} ${stableTokenId} : 1 CELO` : 'Loading...'}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-5">
          <div className="w-32 text-right mr-6">Max Slippage:</div>
          <div className="w-32">{`${slippage}%`}</div>
        </div>
        <div className="flex items-center mt-3">
          <div className="w-32 text-right mr-6">Min Received:</div>
          <div className="w-32">CELO TODO</div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <SolidButton dark={true} size="m" onClick={onSubmit}>
          Swap
        </SolidButton>
      </div>
    </FloatingBox>
  )
}

function RightCircleArrow() {
  return (
    <div className="bg-greengray-lightest">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill={Color.primaryBlack50}
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
        />
      </svg>
    </div>
  )
}
