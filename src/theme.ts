import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: '"Inter", system-ui, -apple-system, sans-serif' },
        body: { value: '"Inter", system-ui, -apple-system, sans-serif' },
        mono: { value: '"JetBrains Mono", "Fira Code", "SF Mono", monospace' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
