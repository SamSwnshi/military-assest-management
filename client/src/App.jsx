import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import NotFound from './pages/NotFound/NotFound'
import Layout from './component/Layout/Layout'

function App() {


  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Layout />}>

        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
