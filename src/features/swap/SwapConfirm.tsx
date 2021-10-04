import { useContractKit } from '@celo-tools/use-contractkit'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { NativeTokenId, NativeTokens } from 'src/config/tokens'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { getExchangeContract } from 'src/features/swap/contracts'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import LeftArrow from 'src/images/icons/arrow-left-circle.svg'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Color } from 'src/styles/Color'
import { toWei } from 'src/utils/amount'
import { logger } from 'src/utils/logger'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirm(props: Props) {
  const { fromAmount, fromTokenId, toTokenId } = props.formValues
  const dispatch = useAppDispatch()
  const { address, kit, performActions } = useContractKit()

  useEffect(() => {
    // Validate formValues on mount, otherwise bail
    if (!fromAmount || !fromTokenId || !toTokenId) {
      dispatch(setFormValues(null))
    }
  }, [fromAmount, fromTokenId, toTokenId, dispatch])

  const onSubmit = async () => {
    if (!address || !kit) return
    try {
      await performActions(async (k) => {
        const stableTokenId = fromTokenId === NativeTokenId.CELO ? toTokenId : fromTokenId
        const sellGold = fromTokenId === NativeTokenId.CELO
        const contract = await getExchangeContract(k, stableTokenId)
        const amountInWei = toWei(fromAmount)
        // TODO adjust amount based on balance
        // TODO actual minBuyAmount
        // TODO test throwing error in here
        const minBuyAmount = new BigNumber(amountInWei).multipliedBy(0.98)
        const tx = await contract.sell(amountInWei, minBuyAmount, sellGold)
        const receipt = await tx.sendAndWaitForReceipt()
        logger.info(`Tx receipt received for swap: ${receipt.transactionHash}`)
        // TODO getconenctedkit here and throughout?
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

  const fromToken = NativeTokens[fromTokenId]
  const toToken = NativeTokens[toTokenId]

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
        <div style={{ width: 26, height: 26 }}></div>
      </div>
      <div className="mt-6 bg-greengray-lightest rounded-md">
        <div className="relative flex items-center justify-between">
          <div className="flex flex-1 items-center px-4 pt-4 pb-2 border-r border-gray-400">
            <TokenIcon size="l" token={fromToken} />
            <div className="flex flex-col ml-3">
              <div className="text-sm">{fromToken.symbol}</div>
              <div className="text-lg font-mono leading-6">{fromAmount}</div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end px-4 pt-4 pb-2">
            <div className="flex flex-col items-end mr-3">
              <div className="text-sm">{toToken.symbol}</div>
              <div className="text-lg font-mono leading-6">{fromAmount}</div>
            </div>
            <TokenIcon size="l" token={toToken} />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
            <RightCircleArrow />
          </div>
        </div>
        <div className="flex items-end justify-center">
          <div className="py-1 px-3 border border-b-0 border-black50 text-black50 text-sm rounded-t">
            5.21 cUSD : 1 CELO
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-sm">
        <div className="flex items-center mt-5">
          <div className="w-32 text-right mr-6">Max Slippage:</div>
          <div className="w-32">1%</div>
        </div>
        <div className="flex items-center mt-3">
          <div className="w-32 text-right mr-6">Min Received:</div>
          <div className="w-32">CELO 1013.630</div>
        </div>
        <div className="flex items-center mt-3">
          <div className="w-32 text-right mr-6">Gas Fee:</div>
          <div className="w-32">CELO 0.001</div>
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
