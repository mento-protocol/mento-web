import { config } from 'src/config/config'
import { TokenId } from 'src/config/tokens'
import { PriceChartCelo } from 'src/features/chart/PriceChartCelo'
import { useAppSelector } from 'src/features/store/hooks'
import { SwapConfirmCard } from 'src/features/swap/SwapConfirm'
import { SwapFormCard } from 'src/features/swap/SwapForm'

export default function SwapPage() {
  const { formValues, showChart } = useAppSelector((state) => state.swap)
  return (
    <div className="flex justify-center items-center h-full flex-wrap w-full">
      <div className="mb-6 w-full max-w-md">
        {!formValues ? <SwapFormCard /> : <SwapConfirmCard formValues={formValues} />}
      </div>
      {config.showPriceChart && showChart && (
        <div className="mb-6 md:ml-10">
          <PriceChartCelo stableTokenId={TokenId.cUSD} height={265} />
        </div>
      )}
    </div>
  )
}
