import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Router,Routes,Route } from 'react-router-dom'
import Signup from './Component/Signup'
import Dashboard from './Component/Dashboard'
import Marketplace from './Component/Marketplace'
import Program from './Component/Program'
import LinkGenerator from './Component/LinkGenerator'
import Performance from './Component/Performance'
import Payout from './Component/Payout'


function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='Dashboard' element={<Dashboard/>}/>
      <Route path='Marketplace' element={<Marketplace/>}/>
      <Route path='Program' element={<Program/>}/>
      <Route path='LinkGenerator' element={<LinkGenerator/>}/>
      <Route path='Performance' element={<Performance/>}/>
      <Route path='Payout' element={<Payout/>}/>
      
    </Routes>
      
    </>
  )
}

export default App
