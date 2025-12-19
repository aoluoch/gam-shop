import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Honeybadger, HoneybadgerErrorBoundary } from '@honeybadger-io/react'
import './index.css'
import App from './App.tsx'

const honeybadger = Honeybadger.configure({
  apiKey: import.meta.env.VITE_HONEYBADGER_API_KEY,
  environment: import.meta.env.MODE,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HoneybadgerErrorBoundary honeybadger={honeybadger}>
      <App />
    </HoneybadgerErrorBoundary>
  </StrictMode>,
)
