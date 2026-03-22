import { ThemeProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'

export function ColorModeProvider(props: ThemeProviderProps & { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
      {...props}
    />
  )
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return {
    colorMode: resolvedTheme as 'light' | 'dark',
    setColorMode: setTheme,
    toggleColorMode: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    theme,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
