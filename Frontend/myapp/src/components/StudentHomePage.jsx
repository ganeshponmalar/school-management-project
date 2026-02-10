import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentHomePage.css";

const StudentHomePage = () => {
  const [students, setStudents] = useState([]);

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

  const [editId, setEditId] = useState(null);

  // GET ALL STUDENTS
  const getStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/student/get-allStudent"
      );
      console.log(res,'response')
      setStudents(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };
  

  useEffect(() => {
    getStudents();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: formData.userId,
      classId: formData.classId,
      section: formData.section,
      rollNumber: formData.rollNumber,
      admissionDate: formData.admissionDate,
      guardianInfo: {
        name: formData.guardianName,
        phone: formData.guardianPhone,
        relation: formData.guardianRelation
      }
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/student/update-student/${editId}`,
          payload
        );
        alert("Student updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/student/create-student",
          payload
        );
        alert("Student added successfully");
      }

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

      getStudents();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setEditId(student._id);

    setFormData({
      userId: student.userId?._id || "",
      classId: student.classId?._id || "",
      section: student.section,
      rollNumber: student.rollNumber,
      admissionDate: student.admissionDate?.split("T")[0],
      guardianName: student.guardianInfo?.name || "",
      guardianPhone: student.guardianInfo?.phone || "",
      guardianRelation: student.guardianInfo?.relation || ""
    });
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/student/delete-student/${id}`
      );
      alert("Student deleted");
      getStudents();
    } catch (err) {
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

      <div className="student-container">
        <h2>Student Management</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="student-form">

          <input name="userId" placeholder="User ID"
            value={formData.userId} onChange={handleChange} required />

          <input name="classId" placeholder="Class ID"
            value={formData.classId} onChange={handleChange} required />

          <input name="section" placeholder="Section"
            value={formData.section} onChange={handleChange} required />

          <input name="rollNumber" placeholder="Roll Number"
            value={formData.rollNumber} onChange={handleChange} required />

          <input type="date" name="admissionDate"
            value={formData.admissionDate} onChange={handleChange} required />

          <h4>Guardian Info</h4>

          <input name="guardianName" placeholder="Guardian Name"
            value={formData.guardianName} onChange={handleChange} required />

          <input name="guardianPhone" placeholder="Guardian Phone"
            value={formData.guardianPhone} onChange={handleChange} required />

          <input name="guardianRelation" placeholder="Relation"
            value={formData.guardianRelation} onChange={handleChange} required />

          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </form>

        {/* STUDENT LIST */}
        <h3>All Students</h3>

        {students.map((s) => (
          <div key={s._id} className="student-card">
            <p><b>Roll:</b> {s.rollNumber}</p>
            <p><b>Section:</b> {s.section}</p>
            <p><b>Guardian:</b> {s.guardianInfo?.name}</p>

            <button className="edit-btn"
              onClick={() => handleEdit(s)}>
              Update
            </button>

            <button className="delete-btn"
              onClick={() => handleDelete(s._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>
    </>
  );
};

export default StudentHomePage;