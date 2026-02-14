import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherHomePage.css";

const TeacherHomePage = () => {

  // Stores all teachers fetched from backend API
  const [teachers, setTeachers] = useState([]);

  // Used to track editing mode (null = create mode)
  const [editId, setEditId] = useState(null);

  // Form state for teacher create/update operations
  const [formData, setFormData] = useState({
    userId: "",
    subject: "",
    department: "",
    hireDate: "",
    qualification: ""
  });

  /* =========================================================
     FETCH ALL TEACHERS
     - Called when component loads
     - Also called after create/update/delete to refresh list
  ========================================================== */
  const getTeachers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/teacher/get-teacher"
      );
      setTeachers(res.data.teachers);
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  // Run only once when component mounts
  useEffect(() => {
    getTeachers();
  }, []);

  /* =========================================================
     HANDLE FORM INPUT CHANGE
     - Updates only the changed input field
     - Keeps other fields unchanged using spread operator
  ========================================================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* =========================================================
     CREATE OR UPDATE TEACHER
     - If editId exists → update teacher
     - Otherwise → create new teacher
  ========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // Update existing teacher
        await axios.put(
          `http://localhost:5000/api/v1/teacher/update-teacher/${editId}`,
          formData
        );
        alert("Teacher Updated Successfully");
      } else {
        // Create new teacher
        await axios.post(
          "http://localhost:5000/api/v1/teacher/create-teacher",
          formData
        );
        alert("Teacher Created Successfully");
      }

      // Reset form after submission
      setFormData({
        userId: "",
        subject: "",
        department: "",
        hireDate: "",
        qualification: ""
      });

      setEditId(null); // back to create mode
      getTeachers();   // refresh teacher list

    } catch (err) {
      alert(err.response?.data?.message || "Error saving teacher");
    }
  };

  /* =========================================================
     EDIT TEACHER
     - Loads selected teacher data into form
     - Converts date format for input field compatibility
  ========================================================== */
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

  /* =========================================================
     DELETE TEACHER
     - Shows confirmation popup before deletion
     - Refreshes teacher list after deletion
  ========================================================== */
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
      {/* ================= HEADER SECTION ================= */}
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/policy">Policy</a>
          <a href="/service">Service</a>
          <a href="/help">Help</a>
        </nav>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <div className="teacher-container">
        <h2>Teacher Management</h2>

        {/* FORM FOR CREATE / UPDATE TEACHER */}
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

          {/* Button label changes based on edit mode */}
          <button type="submit">
            {editId ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>

        {/* ================= TEACHER LIST ================= */}
        <h3>All Teachers</h3>

        <div className="teacher-list">
          {teachers.map((t) => (
            <div key={t._id} className="teacher-card">
              <p><b>Subject:</b> {t.subject}</p>
              <p><b>Department:</b> {t.department}</p>
              <p><b>Qualification:</b> {t.qualification}</p>

              {/* Edit button */}
              <button
                className="edit-btn"
                onClick={() => handleEdit(t)}
              >
                Update
              </button>

              {/* Delete button */}
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

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>
    </>
  );
};

export default TeacherHomePage;