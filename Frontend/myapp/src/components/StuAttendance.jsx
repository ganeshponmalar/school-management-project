import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuAttendance.css";

const StuAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    date: "",
    status: ""
  });

  // GET ALL ATTENDANCE
  const getAttendance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/attendance/get-allattendance"
      );
      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/attendance/update-attendance/${editId}`,
          formData
        );
        alert("Attendance Updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/attendance/create-attendance",
          formData
        );
        alert("Attendance Created");
      }

      setFormData({
        studentId: "",
        classId: "",
        date: "",
        status: ""
      });

      setEditId(null);
      getAttendance();
    } catch (err) {
      alert("Error occurred");
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      studentId: item.studentId?._id || "",
      classId: item.classId || "",
      date: item.date?.substring(0, 10),
      status: item.status
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete attendance?")) return;

    await axios.delete(
      `http://localhost:5000/api/v1/attendance/delete-attendance/${id}`
    );

    alert("Deleted");
    getAttendance();
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h2>School Management</h2>
      </header>

      <div className="attendance-container">
        <h2>Attendance Management</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="attendance-form">
          <input
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />

          <input
            name="classId"
            placeholder="Class ID"
            value={formData.classId}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

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

          <button>
            {editId ? "Update Attendance" : "Add Attendance"}
          </button>
        </form>

        {/* ATTENDANCE LIST */}
        <div className="attendance-grid">
          {attendance.map((item) => (
            <div key={item._id} className="attendance-card">
              <p>
                <b>Student:</b> {item.studentId?.name}
              </p>

              <p>
                <b>Date:</b>{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>

              <p>
                <b>Status:</b> {item.status}
              </p>

              <div className="btn-group">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(item)}
                >
                  Update
                </button>

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

      {/* FOOTER */}
      <footer className="footer">
        © 2026 Attendance System
      </footer>
    </>
  );
};

export default StuAttendance;