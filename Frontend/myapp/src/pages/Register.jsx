// React hook for managing component state
import { useState } from "react";

// Axios for making HTTP API requests
import axios from "axios";

// CSS styling for register page
import "./Register.css";

// React Router link for navigation
import { Link } from "react-router-dom";

const Register = () => {

  /*
    FORM STATE
    Stores all registration inputs in one object.
    Helps easy form handling and API submission.
  */
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

  /*
    HANDLE INPUT CHANGE
    - Updates specific field dynamically
    - Spread operator keeps existing values
    - Computed property updates correct input field
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
    HANDLE FORM SUBMIT
    - Sends registration data to backend API
    - Shows success/error message
    - Clears form after successful registration
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/create_user",
        formData
      );

      alert(res.data.message);

      // Reset form after successful registration
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
      {/* HEADER SECTION */}
      <header className="header">
        <h2 className="logo">SchoolMS</h2>

        {/* Navigation menu (static links for now) */}
        <nav>
          <ul className="nav-links">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Policy</li>
          </ul>
        </nav>

        {/* Redirect to login page */}
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </header>

      {/* REGISTRATION FORM */}
      <div className="register-container">
        <form
          className="register-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2>Register</h2>

          {/* USER NAME */}
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* ROLE SELECTION */}
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

          {/* PHONE NUMBER */}
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* ADDRESS */}
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {/* DATE OF BIRTH */}
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          {/* GENDER */}
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

          {/* SUBMIT BUTTON */}
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;