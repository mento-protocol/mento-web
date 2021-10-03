import { MAX_TOKEN_PRICE_NUM_DAYS, STALE_TOKEN_PRICE_TIME } from 'src/config/consts'
import { NativeTokenId } from 'src/config/tokens'
import {
  QuoteCurrency,
  QuoteCurrencyPriceHistory,
  TokenPriceHistory,
} from 'src/features/chart/types'
import { areDatesSameDay } from 'src/utils/time'

export function tokenPriceHistoryToChartData(
  prices: TokenPriceHistory | undefined,
  numDays = 7
): ChartData {
  let dataValues = generateChartData(numDays, (date: Date) => findPriceForDay(prices, date))

  if (dataValues.length < 3) {
    // Set default for 0-ed out chart, shown while things are loading
    dataValues = generateChartData(numDays, () => 0)
  }

  return prepareChartData(dataValues)
}

function generateChartData(numDays: number, getPrice: (date: Date) => number | null) {
  const dataValues: DataValue[] = []
  const date = new Date()
  date.setDate(date.getDate() - numDays + 1)
  for (let i = 0; i < numDays; i++) {
    const label = dateToChartLabel(date)
    const value = getPrice(date)
    if (value !== null && value !== undefined) dataValues.push({ label, values: [value] })
    date.setDate(date.getDate() + 1)
  }
  return dataValues
}

export function findPriceForDay(prices: TokenPriceHistory | undefined, date: Date) {
  if (!prices) return null
  for (const p of prices) {
    if (areDatesSameDay(date, new Date(p.timestamp))) {
      return p.price
    }
  }
  return null
}

// Looks through the current store data to find all days for which
// price data is missing. Returns an array of days to query for
// E.g. [1,4] means days for 1 day ago and 4 days ago are needed
export function findMissingPriceDays(numDays: number, prices?: QuoteCurrencyPriceHistory) {
  const now = new Date()
  const daysInData = new Map<number, boolean>()
  // This assumes if day's price for cusd exists, they all do
  // Should be true because all returned in the same blockscout query
  if (prices && prices[NativeTokenId.cUSD]) {
    for (const p of prices[NativeTokenId.cUSD]!) {
      const pDate = new Date(p.timestamp).getDate()
      // This check is to exclude prices from today that are older than STALE_TOKEN_PRICE_TIME
      // This forces re-fetching of today's prices to keep the data up to date
      if (pDate !== now.getDate() || now.getTime() - p.timestamp < STALE_TOKEN_PRICE_TIME) {
        daysInData.set(pDate, true)
      }
    }
  }

  const missingDayList = []
  const dayCounter = new Date()
  for (let i = 0; i < numDays; i++) {
    if (!daysInData.has(dayCounter.getDate())) {
      missingDayList.push(i)
    }
    dayCounter.setDate(dayCounter.getDate() - 1)
  }
  return missingDayList
}

// Cleans up old price lists and merges in new prices updates
export function mergePriceHistories(
  newCurrencyToPrices: QuoteCurrencyPriceHistory,
  oldCurrencyToPrices: QuoteCurrencyPriceHistory = {}
) {
  const minTimestamp = Date.now() - MAX_TOKEN_PRICE_NUM_DAYS * 86400 * 1000
  const mergedPrices: QuoteCurrencyPriceHistory = {}
  for (const key of Object.keys(NativeTokenId)) {
    const quoteCurrency = key as QuoteCurrency // TS limitation of Object.keys()
    const newPrices = newCurrencyToPrices[quoteCurrency] || []
    const oldPrices = oldCurrencyToPrices[quoteCurrency] || []
    // Clear out stale data older than MAX_HISTORY_NUM_DAYS
    // or data with the same day as a new price
    const oldPricesFiltered = oldPrices.filter((p) => {
      if (p.timestamp < minTimestamp) return false
      const day = new Date(p.timestamp).getDate()
      if (newPrices.find((np) => new Date(np.timestamp).getDate() === day)) return false
      return true
    })
    mergedPrices[quoteCurrency] = [...oldPricesFiltered, ...newPrices]
  }
  return mergedPrices
}

export interface DataValue {
  label: string
  values: Array<number | null>
}

export interface ChartData {
  labels: string[]
  datasets: Array<{ name: string; values: Array<number | null> }>
}

export function prepareChartData(data: DataValue[]): ChartData {
  if (!data || data.length === 0) throw Error('Data is required for chart')

  const initial: ChartData = { labels: [], datasets: [] }

  const results = data.reduce((result: ChartData, item: DataValue) => {
    result.labels.push(item.label)

    item.values.forEach((value, index) => {
      if (result.datasets.length <= index) {
        result.datasets.push({ name: '', values: [value] })
      } else {
        result.datasets[index].values.push(value)
      }
    })
    return result
  }, initial)

  return results
}

export function dateToChartLabel(date: Date) {
  const day = date.getDate()
  switch (date.getMonth()) {
    case 0:
      return `Jan ${day}`
    case 1:
      return `Feb ${day}`
    case 2:
      return `Mar ${day}`
    case 3:
      return `Apr ${day}`
    case 4:
      return `May ${day}`
    case 5:
      return `Jun ${day}`
    case 6:
      return `Jul ${day}`
    case 7:
      return `Aug ${day}`
    case 8:
      return `Sep ${day}`
    case 9:
      return `Oct ${day}`
    case 10:
      return `Nov ${day}`
    case 11:
      return `Dec ${day}`
    default:
      throw new Error('Invalid date')
  }
}
