import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

function App() {


  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Sidebar />} />
           <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  )
}

export default App
