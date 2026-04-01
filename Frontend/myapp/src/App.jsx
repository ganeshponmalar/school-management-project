// React Router imports for routing/navigation
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import ParentHomePage from './components/ParentHomePage';

// Student-related feature components
import StuAttendance from './components/StuAttendance';
import FeesPayment from './components/FeesPayment';
import StuExam from './components/StuExam';
import StuResult from './components/stuResult';
import StuClass from './components/StuClass';
import AllTeacher from './components/AllTeacher';
import AllAdmin from './components/AllAdmin';
import AllStudent from './components/AllStudent';
import ParentAttendance from './components/ParentAttendance';
import ParentMarks from './components/ParentMarks';
import ParentFees from './components/ParentFees';
import ParentCommunication from './components/ParentCommunication';

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />

        {/* ---------- DASHBOARD ROUTES ---------- */}
        <Route path="/student-home" element={<StudentHomePage />} />
        <Route path="/teacher-home" element={<TeacherHomePage />} />
        <Route path="/admin-home" element={<AdminHomePage />} />
        <Route path="/parent-home" element={<ParentHomePage />} />

        {/* ---------- STUDENT FUNCTIONALITY ---------- */}
        <Route path="/stu-att" element={<StuAttendance />} />
        <Route path="/feesPay" element={<FeesPayment />} />
        <Route path="/stu-exam" element={<StuExam />} />
        <Route path="/stu-result" element={<StuResult />} />
        <Route path="/stu-class" element={<StuClass />} />
        <Route path="/all-teacher" element={<AllTeacher />} />
        <Route path="/all-admin" element={<AllAdmin />} />
        <Route path="/all-student" element={<AllStudent />} />

        {/* ---------- PARENT FUNCTIONALITY ---------- */}
        <Route path="/parent/attendance/:studentId" element={<ParentAttendance />} />
        <Route path="/parent/marks/:studentId" element={<ParentMarks />} />
        <Route path="/parent/fees/:studentId" element={<ParentFees />} />
        <Route path="/parent/communication/:studentId" element={<ParentCommunication />} />
      </Routes>
    </Router>
  );
}

export default App;