// React hooks for state management
import React, { useState } from "react";

// Axios for HTTP API calls
import axios from "axios";

// React Router utilities for navigation and links
import { Link, useNavigate } from "react-router-dom";

// Custom authentication context hook
import { useAuth } from "../Context/AuthContext";

// CSS styling for login page
import "./Login.css";

const Login = () => {
  // React Router navigation function
  const navigate = useNavigate();

  // Access login function from AuthContext
  const { loginUser } = useAuth();

  // Form state to store login inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });

  /*
    HANDLE INPUT CHANGE
    - Updates form state dynamically
    - Uses computed property name ([e.target.name])
    - Keeps other fields unchanged using spread operator
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //spred operator keep copy of previce data while user add any data it make copy with other related sub values

  /*
    HANDLE LOGIN SUBMISSION
    - Sends login request to backend
    - Saves user data in global context
    - Redirects based on role (Admin/Teacher/Student)
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend API
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/logIn-user",
        formData,
        { withCredentials: true } // Enables cookies if JWT stored there
      );

      console.log("Response:", res.data);

      // Validate backend response
      if (!res.data?.user) {
        alert("User data missing from backend");
        return;
      }

      const userData = res.data.user;

      // Store user globally (AuthContext + localStorage)
      loginUser(userData);

      alert(res.data.message);

      // Normalize role string (avoid case mismatch)
      const role = userData.role.toLowerCase();

      /*
        ROLE-BASED REDIRECTION
        - Redirect user to respective dashboard
      */
      if (role === "admin") {
        navigate("/admin-home");
      } else if (role === "teacher") {
        navigate("/teacher-home");
      } else if (role === "student") {
        navigate("/student-home");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <>
      {/* HEADER SECTION */}
      <header className="header">
        <h2>School Management</h2>

        {/* Navigation links */}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/policy">Policy</Link>
          <Link to="/services">Service</Link>
          <Link to="/help">Help</Link>
        </nav>
      </header>

      {/* LOGIN FORM CONTAINER */}
      <div className="container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {/* EMAIL INPUT */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          {/* PASSWORD INPUT */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          {/* ROLE SELECTION */}
          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {/* SUBMIT BUTTON */}
          <button type="submit">Login</button>

          {/* REGISTRATION LINK */}
          <p>
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;