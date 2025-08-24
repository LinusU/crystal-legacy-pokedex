import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'

import GlobalShortcuts from './component/global-shortcuts'
import HMsPage from './hms'
import Home from './home'
import MovePage from './move'
import PokemonPage from './pokemon'

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <BrowserRouter basename="/crystal-legacy-pokedex">
      <GlobalShortcuts />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="pokemon/:slug" element={<PokemonPage />} />
        <Route path="move/:slug" element={<MovePage />} />
        <Route path="hms" element={<HMsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
