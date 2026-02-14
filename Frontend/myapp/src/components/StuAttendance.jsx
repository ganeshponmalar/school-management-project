// Import React library and hooks
// useState -> manage component state
// useEffect -> run side effects like API calls
import React, { useEffect, useState } from "react";

// Axios is used to communicate with backend APIs
import axios from "axios";

// CSS file for styling attendance page
import "./StuAttendance.css";

// Main Attendance Component
const StuAttendance = () => {

  // Store all attendance records fetched from backend
  const [attendance, setAttendance] = useState([]);

  // Store ID of attendance record being edited
  // null means create mode
  const [editId, setEditId] = useState(null);

  // Form state for creating/updating attendance
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    date: "",
    status: ""
  });

  // ======================================
  // FETCH ALL ATTENDANCE FROM BACKEND
  // ======================================
  const getAttendance = async () => {

    // Debug log to verify function call
    console.log(getAttendance, "from allattendance");

    try {
      // GET API request to fetch attendance records
      const res = await axios.get(
        "http://localhost:5000/api/v1/attendance/get-allattendance"
      );

      // Save fetched attendance data in state
      // If no data, set empty array
      setAttendance(res.data.attendance || []);

    } catch (err) {
      console.log(err);
    }
  };

  // Run once when component loads
  useEffect(() => {
    getAttendance();
  }, []);  //emty dependancey will run once 

  // ======================================
  // HANDLE INPUT FIELD CHANGES
  // ======================================
  const handleChange = (e) => {

    // Spread operator keeps previous form values
    // Only updated field changes
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ======================================
  // CREATE NEW ATTENDANCE OR UPDATE EXISTING
  // ======================================
  const handleSubmit = async (e) => {

    // Prevent default form reload behavior
    e.preventDefault();

    try {

      // If editId exists -> update attendance
      if (editId) {

        await axios.put(
          `http://localhost:5000/api/v1/attendance/update-attendance/${editId}`,
          formData
        );

        alert("Attendance Updated");

      } else {

        // Otherwise create new attendance record
        await axios.post(
          "http://localhost:5000/api/v1/attendance/create-attendance",
          formData
        );

        alert("Attendance Created");
      }

      // Reset form fields after submit
      setFormData({
        studentId: "",
        classId: "",
        date: "",
        status: ""
      });

      // Exit edit mode
      setEditId(null);

      // Refresh attendance list
      getAttendance();

    } catch (err) {
      alert("Error occurred");
    }
  };

  // ======================================
  // EDIT ATTENDANCE RECORD
  // Pre-fill form with selected record
  // ======================================
  const handleEdit = (item) => {

    // Store selected attendance ID
    setEditId(item._id);

    // Populate form with existing data
    setFormData({
      studentId: item.studentId?._id || "",
      classId: item.classId || "",
      // Convert ISO date format to yyyy-mm-dd
      date: item.date?.substring(0, 10),
      status: item.status
    });
  };

  // ======================================
  // DELETE ATTENDANCE RECORD
  // ======================================
  const handleDelete = async (id) => {

    console.log(handleDelete, "fromdelete attendance");

    // Confirmation before deleting
    if (!window.confirm("Delete attendance?")) return;

    // Delete request to backend
    await axios.delete(
      `http://localhost:5000/api/v1/attendance/delete-attendance/${id}`
    );

    alert("Deleted");

    // Refresh attendance list after deletion
    getAttendance();
  };

  // ======================================
  // UI RENDERING SECTION
  // ======================================
  return (
    <>
      {/* HEADER SECTION */}
      <header className="header">
        <h2>School Management</h2>
      </header>

      <div className="attendance-container">
        <h2>Attendance Management</h2>

        {/* CREATE / UPDATE FORM */}
        <form onSubmit={handleSubmit} className="attendance-form">

          {/* Student ID Input */}
          <input
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />

          {/* Class ID Input */}
          <input
            name="classId"
            placeholder="Class ID"
            value={formData.classId}
            onChange={handleChange}
            required
          />

          {/* Attendance Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* Attendance Status Dropdown */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Leave</option>
          </select>

          {/* Button text changes based on edit mode */}
          <button>
            {editId ? "Update Attendance" : "Add Attendance"}
          </button>
        </form>

        {/* ATTENDANCE LIST DISPLAY */}
        <div className="attendance-grid">
          {attendance.map((item) => (
            <div key={item._id} className="attendance-card">

              {/* Student Name */}
              <p>
                <b>Student:</b> {item.studentId?.name}
              </p>

              {/* Attendance Date */}
              <p>
                <b>Date:</b>{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>

              {/* Attendance Status */}
              <p>
                <b>Status:</b> {item.status}
              </p>

              {/* Action Buttons */}
              <div className="btn-group">

                {/* Edit Button */}
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(item)}
                >
                  Update
                </button>

                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <footer className="footer">
        © 2026 Attendance System
      </footer>
    </>
  );
};

// Export component for use in other pages
export default StuAttendance;
