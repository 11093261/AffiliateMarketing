import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom' // ADD THIS IMPORT
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Add Router HERE, NOT in App.jsx */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
