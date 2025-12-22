import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PuzzleGame from './puzzle.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PuzzleGame />
  </StrictMode>,
)
