import React from "react";
import "./Help.css";

const Help = () => {
  return (
    <div className="help-container">
      <h1 className="help-title">Help Center</h1>

      <p className="help-summary">
        Welcome to the School Management System Help Center. Here you can find
        useful information about using the system, logging in, and accessing
        features for students, teachers, and administrators.
      </p>

      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-box">
        <h3>How to login as Student, Teacher or Admin?</h3>
        <p>
          Simply enter your credentials on the login page. The system will
          recognize your role automatically and give access based on your
          permissions.
        </p>
      </div>

      <div className="faq-box">
        <h3>Who should I contact for technical support?</h3>
        <p>
          Contact your school admin, or email us directly at{" "}
          <strong>support@philroboSchool.com</strong>.
        </p>
      </div>

      <div className="contact-box">
        <h3>Contact Support</h3>
        <p>Still need help? Reach us through the following:</p>
        <ul>
          <li>
            Email: <strong>support@eduSchool.com</strong>
          </li>
          <li>Phone Hours: Sunday to Thursday, 9 AM to 5 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;