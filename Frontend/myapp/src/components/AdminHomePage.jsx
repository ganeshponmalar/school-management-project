import { useState } from "react";
import "./AdminHomePage.css";
import StudentHomePage from "./StudentHomePage";
import TeacherHomePage from "./TeacherHomePage";
import StuAttendance from "./StuAttendance";
import StuExam from "./StuExam";
import StuResult from "./stuResult";
import StuClass from "./StuClass";
import FeesHomePage from "./FeesPayment";

const AdminHomePage = () => {
  const [activePage, setActivePage] = useState("admin");

  // SWITCH CASE CONTENT
  const renderContent = () => {
    switch (activePage) {
      case "student":
        return <StudentHomePage/>

      case "teacher":
        return <TeacherHomePage/>

      case "attendance":
        return <StuAttendance/>

      case "fees":
        return <FeesHomePage/>

      case "exam":
        return <StuExam/>

      case "result":
        return <StuResult/>

      case "class":
        return <StuClass/>

      default:
        return <h2>Admin Dashboard Home</h2>;
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h2>School Management System</h2>
      </header>

      {/* BODY */}
      <div className="main">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Dashboard</h3>

          <button onClick={() => setActivePage("student")}>Student Home</button>
          <button onClick={() => setActivePage("teacher")}>Teacher Home</button>
          <button onClick={() => setActivePage("attendance")}>Attendance</button>
          <button onClick={() => setActivePage("fees")}>Fees Payment</button>
          <button onClick={() => setActivePage("exam")}>Exam</button>
          <button onClick={() => setActivePage("result")}>Result</button>
          <button onClick={() => setActivePage("class")}>Class</button>
        </aside>

        {/* CONTENT AREA */}
        <section className="content">
          {renderContent()}
        </section>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>

    </div>
  );
};

export default AdminHomePage;


