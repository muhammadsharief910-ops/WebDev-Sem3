import React from 'react'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'

import { BrowserRouter, Routes, Route } from 'react-router-dom'



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Signup/>} />
      <Route path="/login" element = {<Login/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
