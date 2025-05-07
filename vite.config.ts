import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Using custom domain, so base is just '/'
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: './tailwind.config.cjs',
        }),
        autoprefixer
      ],
    },
  },
})
