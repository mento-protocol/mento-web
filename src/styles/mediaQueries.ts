import { useEffect, useState } from 'react'

interface WindowSize {
  width?: number
  height?: number
}

// From https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return windowSize
}

export function isWindowSizeMobile(windowWidth: number | undefined) {
  return !!(windowWidth && windowWidth < 768)
}

export function isWindowSizeSmallMobile(windowWidth: number | undefined) {
  return !!(windowWidth && windowWidth < 360)
}

export function useIsMobile() {
  const windowSize = useWindowSize()
  return isWindowSizeMobile(windowSize.width)
}

enum ThemeVariant {
  LIGHT = 'light',
  DARK = 'dark',
}

export function getDarkMode() {
  if (typeof window === 'undefined') {
    return false
  }
  const isDarkLocally = localStorage.theme === ThemeVariant.DARK
  const isThemeConfiguredLocally = 'theme' in localStorage
  const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDarkLocally || (!isThemeConfiguredLocally && isDarkSystem)) {
    return true
  } else {
    return false
  }
}

export function useDarkMode() {
  const [isDarkMode, setDarkMode] = useState(getDarkMode())
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.theme = ThemeVariant.DARK
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = ThemeVariant.LIGHT
    }
  }, [isDarkMode])
  return {
    isDarkMode,
    setDarkMode,
  }
}
