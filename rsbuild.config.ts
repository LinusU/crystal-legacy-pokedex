import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: '/crystal-legacy-pokedex/',
  },
  server: {
    base: '/crystal-legacy-pokedex/',
  },
  tools: {
    postcss: (_, { addPlugins }) => {
      addPlugins(['@tailwindcss/postcss'])
    },
  },
})
