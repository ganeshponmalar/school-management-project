import React from "react";
import "./About.css";
const About = () => {
  return (
    <div className="about-container">
      <h1>About School Management System</h1>

      <p>
        This School Management System is a web-based application designed
        to manage school operations efficiently. It helps administrators,
        teachers, and students interact in one centralized platform.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Student registration and profile management</li>
        <li>Attendance tracking</li>
        <li>Exam results and performance monitoring</li>
        <li>Fees payment management</li>
        <li>Role-based login (Admin, Teacher, Student)</li>
      </ul>

      <h2>Purpose</h2>
      <p>
        The goal of this project is to simplify school administration,
        reduce manual paperwork, and improve communication between
        students, teachers, and management.
      </p>
    </div>
  );
};

export default About;