import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import SignupForm from './Components/Signup'
import FraudPredictionForm from './Components/FraudPredictionForm'
import LoginForm from "./Components/Login"
function App() {
  return (

    <Routes>
      <Route path="/predict" element={<FraudPredictionForm />} />
      <Route path="/signup" element={<SignupForm/>}/>
      <Route path="/login" element={<LoginForm/>}/>

    </Routes>
  )
}

export default App
