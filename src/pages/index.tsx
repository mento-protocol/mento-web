import { useAppSelector } from 'src/app/hooks'
import { config } from 'src/config/config'
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
      {!isMobile && config.showPriceChart && (
        <div className="mb-12 ml-10">
          <PriceChartCelo stableTokenId={NativeTokenId.cUSD} height={265} />
        </div>
      )}
    </div>
  )
}
