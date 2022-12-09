import { Mainnet, useCelo } from '@celo/react-celo'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { NativeTokenId } from 'src/config/tokens'
import styles from 'src/features/chart/PriceChart.module.css'
import { fetchTokenPrice } from 'src/features/chart/fetchPrices'
import { tokenPriceHistoryToChartData } from 'src/features/chart/utils'
import { FloatingBox } from 'src/layout/FloatingBox'
import { Color } from 'src/styles/Color'
import { logger } from 'src/utils/logger'

import ReactFrappeChart from './ReactFrappeChart'

interface PriceChartProps {
  stableTokenId: NativeTokenId
  containerClasses?: string
  height?: number
}

export function PriceChartCelo(props: PriceChartProps) {
  const { stableTokenId, containerClasses, height } = props

  const { kit, initialised, network } = useCelo()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!kit || !initialised || network?.chainId !== Mainnet.chainId) return
    dispatch(
      fetchTokenPrice({
        kit,
        baseCurrency: NativeTokenId.CELO,
      })
    )
      .unwrap()
      .catch((err) => {
        toast.warn('Error retrieving chart data')
        logger.error('Failed to token prices', err)
      })
  }, [dispatch, kit, initialised, network])

  const allPrices = useAppSelector((s) => s.tokenPrice.prices)
  const celoPrices = allPrices[NativeTokenId.CELO]
  const stableTokenPrices = celoPrices ? celoPrices[stableTokenId] : undefined
  const chartData = tokenPriceHistoryToChartData(stableTokenPrices)
  const chartHeight = height || 250

  // Only show chart for Mainnet
  if (network?.chainId !== Mainnet.chainId) return null

  return (
    <FloatingBox width="w-96" classes={`overflow-hidden ${containerClasses}`}>
      <div className="flex justify-between">
        <h2 className="text-md font-medium pl-3 py-1">CELO Price (USD)</h2>
        {/* TODO duration toggle */}
        <div></div>
      </div>
      <div className={`-ml-6 -mr-4 -my-1 ${styles.priceChartContainer}`}>
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
    </FloatingBox>
  )
}

const chartConfig: any = {
  colors: [Color.celoGold],
  axis: { xAxisMode: 'tick' },
  tooltipOptions: { formatTooltipY: (d: number | null) => (d ? `$${d.toFixed(2)}` : null) },
}
