import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

import FraudPredictionForm from './Components/FraudPredictionForm'
function App() {
  return (

    <Routes>
      <Route path="/predict" element={<FraudPredictionForm />} />
    </Routes>
  )
}

export default App
