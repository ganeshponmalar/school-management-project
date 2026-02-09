import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    address: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/create_user",
        formData
      );

      alert(res.data.message);

      // Clear form after success
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        address: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
      });

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h2 className="logo">SchoolMS</h2>

        <nav>
          <ul className="nav-links">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Policy</li>
          </ul>
        </nav>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>

      </header>

      {/* REGISTER FORM */}
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
          <h2>Register</h2>

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;