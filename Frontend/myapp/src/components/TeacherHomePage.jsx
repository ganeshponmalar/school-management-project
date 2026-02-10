import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherHomePage.css";

const TeacherHomePage = () => {
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    subject: "",
    department: "",
    hireDate: "",
    qualification: ""
  });

  // GET ALL TEACHERS
  const getTeachers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/teacher/get-teacher"
      );
      setTeachers(res.data.teachers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeachers();
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
          `http://localhost:5000/api/v1/teacher/update-teacher/${editId}`,
          formData
        );
        alert("Teacher Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/teacher/create-teacher",
          formData
        );
        alert("Teacher Created Successfully");
      }

      setFormData({
        userId: "",
        subject: "",
        department: "",
        hireDate: "",
        qualification: ""
      });

      setEditId(null);
      getTeachers();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // EDIT
  const handleEdit = (teacher) => {
    setEditId(teacher._id);
    setFormData({
      userId: teacher.userId?._id || "",
      subject: teacher.subject,
      department: teacher.department,
      hireDate: teacher.hireDate?.split("T")[0],
      qualification: teacher.qualification
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/teacher/delete-teacher/${id}`
      );
      alert("Teacher Deleted");
      getTeachers();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/policy">Policy</a>
          <a href="/service">Service</a>
          <a href="/help">Help</a>
        </nav>
      </header>

      <div className="teacher-container">
        <h2>Teacher Management</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="teacher-form">

          <input
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
            required
          />

          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            required
          />

          <input
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editId ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>

        {/* TEACHER LIST */}
        <h3>All Teachers</h3>

        <div className="teacher-list">
          {teachers.map((t) => (
            <div key={t._id} className="teacher-card">
              <p><b>Subject:</b> {t.subject}</p>
              <p><b>Department:</b> {t.department}</p>
              <p><b>Qualification:</b> {t.qualification}</p>

              <button
                className="edit-btn"
                onClick={() => handleEdit(t)}
              >
                Update
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(t._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>
    </>
  );
};

export default TeacherHomePage;