import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/logIn-user",
        formData,
        { withCredentials: true }
      );

      console.log("Response:", res.data);

      if (!res.data?.user) {
        alert("User data missing from backend");
        return;
      }

      const userData = res.data.user;

      // Save user to context
      loginUser(userData);

      alert(res.data.message);

      // Normalize role (important)
      const role = userData.role.toLowerCase();

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
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/policy">Policy</Link>
          <Link to="/services">Service</Link>
          <Link to="/help">Help</Link>
        </nav>
      </header>

      <div className="container">
        <form className="login-box" onSubmit={handleSubmit}>
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

          <p>
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;