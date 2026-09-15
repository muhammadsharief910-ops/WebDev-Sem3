import React from 'react'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import ApiTester from './Pages/ApiTester'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
3        <Route path="/tester" element={<ApiTester />} />
        <Route path="/profile" element={<ApiTester />} />
        <Route path="/me" element={<ApiTester />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
