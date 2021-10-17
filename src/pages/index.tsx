import { useAppSelector } from 'src/app/hooks'
import { NativeTokenId } from 'src/config/tokens'
import { PriceChartCelo } from 'src/features/chart/PriceChartCelo'
import { SwapConfirm } from 'src/features/swap/SwapConfirm'
import { SwapForm } from 'src/features/swap/SwapForm'
import { useIsMobile } from 'src/styles/mediaQueries'

export default function SwapPage() {
  const { formValues } = useAppSelector((state) => state.swap)
  const isMobile = useIsMobile()
  return (
    <div className="flex justify-center items-center h-full">
      <div className="mb-12">
        {!formValues ? <SwapForm /> : <SwapConfirm formValues={formValues} />}
      </div>
      {!isMobile && (
        <div className="mb-12 ml-12">
          <PriceChartCelo stableTokenId={NativeTokenId.cUSD} showHeaderPrice={true} />
        </div>
      )}
    </div>
  )
}
