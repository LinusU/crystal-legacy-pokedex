import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'

import HMsPage from './hms'
import Home from './home'
import MovePage from './move'
import PokemonPage from './pokemon'

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <BrowserRouter basename="/crystal-legacy-pokedex">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="pokemon/:name" element={<PokemonPage />} />
        <Route path="move/:name" element={<MovePage />} />
        <Route path="hms" element={<HMsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
