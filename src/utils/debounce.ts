import { useEffect, useState } from 'react'

// Based on https://usehooks.com/useDebounce
export function useDebounce<T>(value: T, delayMs = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debouncedValue
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        resolve(func(...args))
      }, wait)
    })
  }
}
