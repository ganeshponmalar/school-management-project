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
import StudentHomePage from './components/StudentHomePage';
import TeacherHomePage from './components/TeacherHomePage';
import AdminHomePage from './components/AdminHomePage';
import StuAttendance from './components/StuAttendance';
import FeesPayment from './components/FeesPayment';
import StuExam from './components/StuExam';
import StuResult from './components/stuResult';
import StuClass from './components/StuClass';


function App() {


  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/student-home" element={<StudentHomePage />} />
        <Route path="/teacher-home" element={<TeacherHomePage />} />
        <Route path="/admin-home" element={<AdminHomePage />} />
        <Route path="/stu-att" element={<StuAttendance />} />
        <Route path="/feesPay" element={<FeesPayment />} />
        <Route path="/stu-exam" element={<StuExam />} />
        <Route path="/stu-result" element={<StuResult />} />
        <Route path="/stu-class" element={<StuClass />} />


        {/* 404 page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>

  )
}

export default App
