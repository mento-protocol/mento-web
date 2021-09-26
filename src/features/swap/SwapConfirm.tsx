import { useEffect } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { NativeTokens } from 'src/config/tokens'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import LeftArrow from 'src/images/icons/arrow-left-circle.svg'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { FloatingBox } from 'src/layout/FloatingBox'

interface Props {
  formValues: SwapFormValues
}

export function SwapConfirm(props: Props) {
  const { fromAmount, fromTokenId, toTokenId } = props.formValues
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Validate formValues on mount, otherwise bail
    if (!fromAmount || !fromTokenId || !toTokenId) {
      dispatch(setFormValues(null))
    }
  }, [fromAmount, fromTokenId, toTokenId, dispatch])

  const onSubmit = () => {
    alert(props.formValues)
  }

  const onClickBack = () => {
    dispatch(setFormValues(null))
  }

  const fromToken = NativeTokens[fromTokenId]
  const toToken = NativeTokens[toTokenId]

  return (
    <FloatingBox width="w-100">
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
      <div className="relative mt-6 pt-4 px-4 bg-greengray-lightest rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TokenIcon size="l" token={fromToken} />
            <div className="flex flex-col ml-3">
              <div>{fromToken.symbol}</div>
              <div className="text-lg font-mono">{fromAmount}</div>
            </div>
          </div>
          <div>|</div>
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-3">
              <div>{toToken.symbol}</div>
              <div className="text-lg font-mono">{fromAmount}</div>
            </div>
            <TokenIcon size="l" token={toToken} />
          </div>
        </div>
        <div className="flex items-end justify-center mt-3">
          <div className="py-1 px-3 border border-b-0 border-gray-400 text-gray-400 text-sm rounded-t">
            5.21 cUSD : 1 CELO
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
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
