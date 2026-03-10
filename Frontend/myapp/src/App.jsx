// React Router imports for routing/navigation
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global authentication context provider
import { AuthProvider } from "./Context/AuthContext.jsx";

// Public pages
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';

import Help from './pages/Help';
import Home from './pages/Home';

import Register from './pages/Register';


// Dashboard components (role-based pages)
import StudentHomePage from './components/StudentHomePage';
import TeacherHomePage from './components/TeacherHomePage';
import AdminHomePage from './components/AdminHomePage';

// Student-related feature components
import StuAttendance from './components/StuAttendance';
import FeesPayment from './components/FeesPayment';
import StuExam from './components/StuExam';
import StuResult from './components/stuResult';
import StuClass from './components/StuClass';
import AllTeacher from './components/AllTeacher';
import AllAdmin from './components/AllAdmin';
import AllStudent from './components/AllStudent';



function App() {
  return (
    // AuthProvider wraps entire app
    // This allows any component to access logged-in user data
    <AuthProvider>

      {/* Router enables client-side routing */}
      <Router>

        {/* Routes container */}
        <Routes>

          {/* ---------- PUBLIC ROUTES ---------- */}

          {/* Default route → Login page */}
          <Route path="/" element={<Login />} />

          {/* Registration page */}
          <Route path="/register" element={<Register />} />

          {/* Static informational pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />


          {/* ---------- DASHBOARD ROUTES ---------- */}
          {/* Role-based home pages after login */}

          <Route path="/student-home" element={<StudentHomePage />} />
          <Route path="/teacher-home" element={<TeacherHomePage />} />
          <Route path="/admin-home" element={<AdminHomePage />} />

          {/* ---------- STUDENT FUNCTIONALITY ---------- */}

          {/* Attendance page */}
          <Route path="/stu-att" element={<StuAttendance />} />

          {/* Fee payment page */}
          <Route path="/feesPay" element={<FeesPayment />} />

          {/* Exam details page */}
          <Route path="/stu-exam" element={<StuExam />} />

          {/* Results page */}
          <Route path="/stu-result" element={<StuResult />} />

          {/* Class management page */}
          <Route path="/stu-class" element={<StuClass />} />
          <Route path="/all-teacher" element={<AllTeacher />} />
          <Route path="/all-admin" element={<AllAdmin />} />
          <Route path="/all-student" element={<AllStudent />} />



          {/* ---------- FALLBACK ROUTE ---------- */}
          {/* Handles unknown URLs */}


        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;