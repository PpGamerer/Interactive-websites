// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Intro from './pages/Intro'
import Punch from './pages/Punch'
import Letter from './pages/Letter'
import RhythmGame from './pages/RhythmGame'
import Phone from './pages/Phone'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RhythmGame />} />
        <Route path="/hbd" element={<Intro />} />
        <Route path="/punch" element={<Punch />} />
        <Route path="/letter" element={<Letter />} />
        <Route path='/boxhunt' element={<Phone />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)