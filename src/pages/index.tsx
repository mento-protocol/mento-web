import { useAppSelector } from 'src/app/hooks'
import { config } from 'src/config/config'
import { NativeTokenId } from 'src/config/tokens'
import { PriceChartCelo } from 'src/features/chart/PriceChartCelo'
import { SwapConfirm } from 'src/features/swap/SwapConfirm'
import { SwapForm } from 'src/features/swap/SwapForm'

export default function SwapPage() {
  const { formValues, showChart } = useAppSelector((state) => state.swap)
  return (
    <div className="flex justify-center items-center h-full flex-wrap">
      <div className="mb-12">
        {!formValues ? <SwapForm /> : <SwapConfirm formValues={formValues} />}
      </div>
      {config.showPriceChart && showChart && (
        <div className="mb-12 md:ml-10">
          <PriceChartCelo stableTokenId={NativeTokenId.cUSD} height={265} />
        </div>
      )}
    </div>
  )
}
