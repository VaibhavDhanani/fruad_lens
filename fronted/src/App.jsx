import React from 'react'
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from './pages/home.page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
