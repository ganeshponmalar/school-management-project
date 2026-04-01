/*
 Admin Dashboard Component
 Purpose:
 - Displays admin dashboard layout
 - Shows logged-in admin info
 - Controls sidebar navigation
 - Renders selected management module
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

/* Dashboard modules */
import StudentHomePage from "./StudentHomePage";
import TeacherHomePage from "./TeacherHomePage";
import StuAttendance from "./StuAttendance";
import StuExam from "./StuExam";
import StuResult from "./stuResult";
import StuClass from "./StuClass";
import FeesHomePage from "./FeesPayment";
import AllAdmin from "./AllAdmin";
import AdmissionForm from "./AdmissionForm";
import AllAdmissions from "./AllAdmissions";
import SendNotification from "./SendNotification";
import LeaveApproval from "./LeaveApproval";

import AllStudent from "./AllStudent";
import AllTeacher from "./AllTeacher";
import AllParents from "./AllParents";
import "./AdminHomePage.css";



const AdminHomePage = () => {

  /* Get authenticated user info and logout method */
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/home");
  };

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

      case "admin-data":
        return <AllAdmin />;

      case "student-data":
        return <AllStudent />;

      case "teacher-data":
        return <AllTeacher />;

      case "add-admission":
        return <AdmissionForm />;

      case "all-admissions":
        return <AllAdmissions />;

      case "send-notification":
        return <SendNotification />;
      case "leave-approval":
        return <LeaveApproval />;
      case "parent-data":
        return <AllParents />;



      default:
        return (
          <div className="welcome-container">
            <h2>welcome to Admin home page</h2>
            <div className="quick-links">
              <button onClick={() => setActivePage("admin-data")}>Admin Data</button>
              <button onClick={() => setActivePage("student-data")}>Student Data</button>
              <button onClick={() => setActivePage("teacher-data")}>Teacher Data</button>
              <button onClick={() => setActivePage("parent-data")}>Parent Data</button>
            </div>
          </div>

        );

    }
  };

  return (
    <div className="app">

      {/* ===== Header Section ===== */}
      <header className="header">
        <h2>School Management System</h2>

        {/* Show user details only when logged in */}
        {user && (
          <div className="user-info">
            <p>Username: {user.name}</p>
            <p>ID: {user._id || user.id}</p>
            <p>Role: {user.role}</p>

            {/* Logout clears auth context */}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <div className="main">

        {/* ===== Sidebar Navigation ===== */}
        <aside className="sidebar">
          <h3>Dashboard</h3>

          {/* Update active section */}
          <button className={activePage === "student" ? "active" : ""} onClick={() => setActivePage("student")}>Student</button>
          <button className={activePage === "teacher" ? "active" : ""} onClick={() => setActivePage("teacher")}>Teacher</button>
          <button className={activePage === "attendance" ? "active" : ""} onClick={() => setActivePage("attendance")}>Attendance</button>
          <button className={activePage === "fees" ? "active" : ""} onClick={() => setActivePage("fees")}>Fees</button>
          <button className={activePage === "exam" ? "active" : ""} onClick={() => setActivePage("exam")}>Exam</button>
          <button className={activePage === "result" ? "active" : ""} onClick={() => setActivePage("result")}>Result</button>
          <button className={activePage === "class" ? "active" : ""} onClick={() => setActivePage("class")}>Class</button>
          <button className={activePage === "admin-data" ? "active" : ""} onClick={() => setActivePage("admin-data")}>Admin Data</button>
          <button className={activePage === "student-data" ? "active" : ""} onClick={() => setActivePage("student-data")}>Student Data</button>
          <button className={activePage === "teacher-data" ? "active" : ""} onClick={() => setActivePage("teacher-data")}>Teacher Data</button>
          <button className={activePage === "add-admission" ? "active" : ""} onClick={() => setActivePage("add-admission")}>Add Admission</button>
          <button className={activePage === "all-admissions" ? "active" : ""} onClick={() => setActivePage("all-admissions")}>All Admissions</button>
          <button className={activePage === "send-notification" ? "active" : ""} onClick={() => setActivePage("send-notification")}>Send Notification</button>
          <button className={activePage === "leave-approval" ? "active" : ""} onClick={() => setActivePage("leave-approval")}>Leave Approval</button>
          <button className={activePage === "parent-data" ? "active" : ""} onClick={() => setActivePage("parent-data")}>Parent Data</button>


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


