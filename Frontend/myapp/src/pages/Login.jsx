import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/logIn-user",
        formData,
        { withCredentials: true }
      );

      alert(res.data.message);

      // Get role from backend response (recommended)
      const role = res.data?.user?.role || formData.role;

      if (role === "teacher") {
        navigate("/teacher-home");
      } else if (role === "student") {
        navigate("/student-home");
      } else if (role === "admin") {
        navigate("/admin-home");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/policy">Policy</Link>
          <Link to="/service">Service</Link>
          <Link to="/help">Help</Link>
        </nav>
      </header>

      {/* LOGIN FORM */}
      <div className="container">
        <form className="login-box" onSubmit={handleSubmit} autoComplete="off">
          <h2>Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <button type="submit">Login</button>

          <p className="register-link">
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;