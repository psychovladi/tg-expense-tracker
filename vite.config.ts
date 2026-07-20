import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo-name>/ — update this if
  // the GitHub repository is named differently from "tg-expense-tracker".
  base: '/tg-expense-tracker/',
})
