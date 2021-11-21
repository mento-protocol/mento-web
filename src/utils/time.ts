import { EXCHANGE_RATE_STALE_TIME } from 'src/config/consts'

export function isStale(lastUpdated: number | null, staleTime: number) {
  return !lastUpdated || Date.now() - lastUpdated > staleTime
}

export function areRatesStale(rates: Record<any, { lastUpdated: number }>) {
  return (
    !rates ||
    !Object.keys(rates).length ||
    Object.values(rates).some((r) => isStale(r.lastUpdated, EXCHANGE_RATE_STALE_TIME))
  )
}

export function areDatesSameDay(d1: Date, d2: Date) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  )
}

export function getDaysBetween(timestamp1: number, timestamp2: number) {
  return Math.round((timestamp2 - timestamp1) / (1000 * 60 * 60 * 24))
}
