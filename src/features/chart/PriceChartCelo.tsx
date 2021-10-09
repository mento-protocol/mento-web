import ReactFrappeChart from 'react-frappe-charts'
import { useAppSelector } from 'src/app/hooks'
import { WEI_PER_UNIT } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
// import { fetchTokenPriceActions } from 'src/features/chart/fetchPrices'
import { findPriceForDay, tokenPriceHistoryToChartData } from 'src/features/chart/utils'
import { calcSimpleExchangeRate } from 'src/features/swap/utils'
import { Color } from 'src/styles/Color'

interface PriceChartProps {
  stableTokenId: NativeTokenId
  showHeaderPrice: boolean
  containerClasses?: string
  height?: number
}

export function PriceChartCelo(props: PriceChartProps) {
  const { stableTokenId, showHeaderPrice, containerClasses, height } = props

  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(
  //     fetchTokenPriceActions.trigger({
  //       baseCurrency: NativeTokenId.CELO,
  //     })
  //   )
  // }, [dispatch])

  const toCeloRates = useAppSelector((s) => s.swap.toCeloRates)
  const allPrices = useAppSelector((s) => s.tokenPrice.prices)
  const celoPrices = allPrices[NativeTokenId.CELO]
  const stableTokenPrices = celoPrices ? celoPrices[stableTokenId] : undefined
  const chartData = tokenPriceHistoryToChartData(stableTokenPrices)

  let headerRate: number | null = null
  if (showHeaderPrice) {
    const cUsdToCelo = toCeloRates[NativeTokenId.cUSD]
    const celoToCUsdRate = cUsdToCelo
      ? calcSimpleExchangeRate(
          WEI_PER_UNIT,
          cUsdToCelo.stableBucket,
          cUsdToCelo.celoBucket,
          cUsdToCelo.spread,
          true
        ).exchangeRateNum
      : null
    headerRate = celoToCUsdRate || findPriceForDay(stableTokenPrices, new Date())
  }

  const chartHeight = height || 250

  return (
    <div className={`flex flex-col ${containerClasses}`}>
      {showHeaderPrice && (
        <div className="flex items-end">
          <label>CELO</label>
          {headerRate ? (
            <label>{`$${headerRate.toFixed(2)} (USD)`}</label>
          ) : (
            <label>Loading...</label>
          )}
        </div>
      )}
      <div>
        <ReactFrappeChart
          type="line"
          colors={chartConfig.colors}
          height={chartHeight}
          axisOptions={chartConfig.axis}
          tooltipOptions={chartConfig.tooltipOptions}
          // @ts-ignore TODO find issue, works in Celo Wallet
          data={chartData}
        />
      </div>
    </div>
  )
}

const chartConfig: any = {
  colors: [Color.celoGold],
  axis: { xAxisMode: 'tick' },
  tooltipOptions: { formatTooltipY: (d: number | null) => (d ? `$${d.toFixed(2)}` : null) },
}
