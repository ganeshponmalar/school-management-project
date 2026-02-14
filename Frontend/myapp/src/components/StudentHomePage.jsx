// Import React library and hooks
// useState -> manage component state
// useEffect -> run side effects like API calls
import React, { useEffect, useState } from "react";

// Axios is used for backend API communication
import axios from "axios";

// CSS styling for this page
import "./StudentHomePage.css";

// Main Student Management Component
const StudentHomePage = () => {

  // Store all students fetched from backend
  const [students, setStudents] = useState([]);

  // Form state for creating/updating student
  const [formData, setFormData] = useState({
    userId: "",
    classId: "",
    section: "",
    rollNumber: "",
    admissionDate: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: ""
  });

  // Holds ID of student currently editing
  // null = create mode
  const [editId, setEditId] = useState(null);

  // ======================================
  // FETCH ALL STUDENTS FROM BACKEND
  // ======================================
  const getStudents = async () => {
    try {
      // GET API call to retrieve students
      const res = await axios.get(
        "http://localhost:5000/api/v1/student/get-allStudent"
      );

      console.log(res, "response");

      // Store students in state
      setStudents(res.data.students);

    } catch (err) {
      console.log(err);
    }
  };

  // Run API call when component mounts
  useEffect(() => {
    getStudents();
  }, []);

  // ======================================
  // HANDLE INPUT FIELD CHANGE
  // Updates specific form field dynamically
  // ======================================
  const handleChange = (e) => {
    setFormData({
      ...formData,               // keep previous values
      [e.target.name]: e.target.value // update changed field
    });
  };

  // ======================================
  // CREATE OR UPDATE STUDENT RECORD
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    // Prepare payload for backend
    const payload = {
      userId: formData.userId,
      classId: formData.classId,
      section: formData.section,
      rollNumber: formData.rollNumber,
      admissionDate: formData.admissionDate,

      // Nested guardian information object
      guardianInfo: {
        name: formData.guardianName,
        phone: formData.guardianPhone,
        relation: formData.guardianRelation
      }
    };

    try {

      // Update existing student if editId exists
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/student/update-student/${editId}`,
          payload
        );
        alert("Student updated successfully");

      } else {
        // Otherwise create new student
        await axios.post(
          "http://localhost:5000/api/v1/student/create-student",
          payload
        );
        alert("Student added successfully");
      }

      // Reset edit mode and form
      setEditId(null);

      setFormData({
        userId: "",
        classId: "",
        section: "",
        rollNumber: "",
        admissionDate: "",
        guardianName: "",
        guardianPhone: "",
        guardianRelation: ""
      });

      // Refresh student list
      getStudents();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ======================================
  // EDIT STUDENT
  // Populate form with selected student data
  // ======================================
  const handleEdit = (student) => {

    // Store student ID for update mode
    setEditId(student._id);

    setFormData({
      userId: student.userId?._id || "",
      classId: student.classId?._id || "",
      section: student.section,
      rollNumber: student.rollNumber,

      // Format date for input field
      admissionDate: student.admissionDate?.split("T")[0],

      guardianName: student.guardianInfo?.name || "",
      guardianPhone: student.guardianInfo?.phone || "",
      guardianRelation: student.guardianInfo?.relation || ""
    });
  };

  // ======================================
  // DELETE STUDENT RECORD
  // ======================================
  const handleDelete = async (id) => {

    // Confirm deletion
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/student/delete-student/${id}`
      );

      alert("Student deleted");

      // Refresh list after delete
      getStudents();

    } catch (err) {
      alert("Delete failed");
    }
  };

  // ======================================
  // UI RENDERING SECTION
  // ======================================
  return (
    <>
      {/* HEADER SECTION */}
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/policy">Policy</a>
          <a href="/service">Service</a>
          <a href="/help">Help</a>
        </nav>
      </header>

      <div className="student-container">
        <h2>Student Management</h2>

        {/* CREATE / UPDATE FORM */}
        <form onSubmit={handleSubmit} className="student-form">

          <input
            name="userId"
            placeholder="User ID"
            value={formData.userId}
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
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            required
          />

          <input
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            required
          />

          {/* Guardian Details Section */}
          <h4>Guardian Info</h4>

          <input
            name="guardianName"
            placeholder="Guardian Name"
            value={formData.guardianName}
            onChange={handleChange}
            required
          />

          <input
            name="guardianPhone"
            placeholder="Guardian Phone"
            value={formData.guardianPhone}
            onChange={handleChange}
            required
          />

          <input
            name="guardianRelation"
            placeholder="Relation"
            value={formData.guardianRelation}
            onChange={handleChange}
            required
          />

          {/* Button label changes in edit mode */}
          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </form>

        {/* STUDENT LIST DISPLAY */}
        <h3>All Students</h3>

        {students.map((s) => (
          <div key={s._id} className="student-card">

            <p><b>Roll:</b> {s.rollNumber}</p>
            <p><b>Section:</b> {s.section}</p>
            <p><b>Guardian:</b> {s.guardianInfo?.name}</p>

            <button
              className="edit-btn"
              onClick={() => handleEdit(s)}
            >
              Update
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(s._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* FOOTER SECTION */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>
    </>
  );
};

// Export component for use in routing/pages
export default StudentHomePage;