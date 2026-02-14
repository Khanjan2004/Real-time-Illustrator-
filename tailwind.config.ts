import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        card: '#131a2c',
        accent: '#5eead4'
      }
    },
  },
  plugins: [],
}

export default config
