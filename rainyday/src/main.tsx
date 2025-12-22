import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AmegaFuttaBirthday from './raining.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AmegaFuttaBirthday />
  </StrictMode>,
)
