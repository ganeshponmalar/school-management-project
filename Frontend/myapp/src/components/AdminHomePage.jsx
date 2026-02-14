/*
 Admin Dashboard Component
 Purpose:
 - Displays admin dashboard layout
 - Shows logged-in admin info
 - Controls sidebar navigation
 - Renders selected management module
*/

import { useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";

/* Dashboard modules */
import StudentHomePage from "./StudentHomePage";
import TeacherHomePage from "./TeacherHomePage";
import StuAttendance from "./StuAttendance";
import StuExam from "./StuExam";
import StuResult from "./stuResult";
import StuClass from "./StuClass";
import FeesHomePage from "./FeesPayment";

import "./AdminHomePage.css";

const AdminHomePage = () => {

  /* Get authenticated user info and logout method */
  const { user, logoutUser } = useAuth();

  /* Controls which dashboard section is visible */
  const [activePage, setActivePage] = useState("admin");

  /*
   Dynamically render dashboard content
   based on sidebar selection
  */
  const renderContent = () => {
    switch (activePage) {
      case "student":
        return <StudentHomePage />;

      case "teacher":
        return <TeacherHomePage />;

      case "attendance":
        return <StuAttendance />;

      case "fees":
        return <FeesHomePage />;

      case "exam":
        return <StuExam />;

      case "result":
        return <StuResult />;

      case "class":
        return <StuClass />;

      default:
        return <h2>Welcome Admin Dashboard</h2>;
    }
  };

  return (
    <div className="app">

      {/* ===== Header Section ===== */}
      <header className="header">
        <h2>School Management System</h2>

        {/* Show admin details only when logged in */}
        {user && (
          <div className="admin-info">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            {/* Logout clears auth context */}
            <button onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>

      <div className="main">

        {/* ===== Sidebar Navigation ===== */}
        <aside className="sidebar">
          <h3>Dashboard</h3>

          {/* Update active section */}
          <button onClick={() => setActivePage("student")}>Student</button>
          <button onClick={() => setActivePage("teacher")}>Teacher</button>
          <button onClick={() => setActivePage("attendance")}>Attendance</button>
          <button onClick={() => setActivePage("fees")}>Fees</button>
          <button onClick={() => setActivePage("exam")}>Exam</button>
          <button onClick={() => setActivePage("result")}>Result</button>
          <button onClick={() => setActivePage("class")}>Class</button>
        </aside>

        {/* ===== Main Content Area ===== */}
        <section className="content">
          {renderContent()}
        </section>

      </div>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <p>© 2026 School Management</p>
      </footer>
    </div>
  );
};

export default AdminHomePage;


