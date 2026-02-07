import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQPage from './pages/FAQPage';
import Help from './pages/Help';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Policy from './pages/Policy';
import Register from './pages/Register';
import Services from './pages/Services';
import Terms from './pages/Terms';


function App() {


  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/terms" element={<Terms />} />

        {/* 404 page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>

  )
}

export default App
