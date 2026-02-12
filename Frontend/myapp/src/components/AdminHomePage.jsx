import { useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";

import StudentHomePage from "./StudentHomePage";
import TeacherHomePage from "./TeacherHomePage";
import StuAttendance from "./StuAttendance";
import StuExam from "./StuExam";
import StuResult from "./stuResult";
import StuClass from "./StuClass";
import FeesHomePage from "./FeesPayment";

import "./AdminHomePage.css";

const AdminHomePage = () => {
  const { user, logoutUser } = useAuth();
  const [activePage, setActivePage] = useState("admin");

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

      {/* HEADER */}
      <header className="header">
        <h2>School Management System</h2>

        {user && (
          <div className="admin-info">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <button onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>

      <div className="main">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Dashboard</h3>

          <button onClick={() => setActivePage("student")}>Student</button>
          <button onClick={() => setActivePage("teacher")}>Teacher</button>
          <button onClick={() => setActivePage("attendance")}>Attendance</button>
          <button onClick={() => setActivePage("fees")}>Fees</button>
          <button onClick={() => setActivePage("exam")}>Exam</button>
          <button onClick={() => setActivePage("result")}>Result</button>
          <button onClick={() => setActivePage("class")}>Class</button>
        </aside>

        {/* CONTENT */}
        <section className="content">
          {renderContent()}
        </section>

      </div>

      <footer className="footer">
        <p>© 2026 School Management</p>
      </footer>
    </div>
  );
};

export default AdminHomePage;


