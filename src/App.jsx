import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './Component/context/AuthContext'
import Signup from './Component/Signup'
import Dashboard from './Component/Dashboard'
import Marketplace from './Component/Marketplace'
import Program from './Component/Program'
import LinkGenerator from './Component/LinkGenerator'
import Performance from './Component/Performance'
import Payout from './Component/Payout'
import Login from './Component/Login'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/program" element={<Program />} />
        <Route path="/link-generator" element={<LinkGenerator />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/payout" element={<Payout />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App