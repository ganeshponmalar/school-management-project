import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuExam.css";

const StuExam = () => {

  // Store all exam records fetched from backend
  const [exams, setExams] = useState([]);

  // Store exam ID when editing (null = create mode)
  const [editId, setEditId] = useState(null);

  // Form state for creating/updating exams
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    startDate: "",
    endDate: ""
  });

  // ================= FETCH ALL EXAMS =================
  const getExams = async () => {
    try {
      // API call to get exam list
      const res = await axios.get(
        "http://localhost:5000/api/v1/exam/get-all-exams"
      );

      // Save exams into state
      setExams(res.data.exams);
    } catch (err) {
      console.log(err);
    }
  };

  // Run once when component loads
  useEffect(() => {
    getExams();
  }, []);

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData, // keep existing values
      [e.target.name]: e.target.value // update changed field
    });
  };

  // ================= CREATE OR UPDATE EXAM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // UPDATE exam if editId exists
        await axios.put(
          `http://localhost:5000/api/v1/exam/update-exam/${editId}`,
          formData
        );
        alert("Exam Updated Successfully");
      } else {
        // CREATE new exam
        await axios.post(
          "http://localhost:5000/api/v1/exam/create-exam",
          formData
        );
        alert("Exam Created Successfully");
      }

      // Reset form after submit
      setFormData({
        name: "",
        classId: "",
        startDate: "",
        endDate: ""
      });

      setEditId(null); // switch back to create mode
      getExams(); // refresh exam list

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ================= EDIT EXAM =================
  const handleEdit = (exam) => {

    // Save selected exam ID for update
    setEditId(exam._id);

    // Fill form with existing exam data
    setFormData({
      name: exam.name,
      classId: exam.classId?._id || "",
      startDate: exam.startDate?.split("T")[0], // format date
      endDate: exam.endDate?.split("T")[0]
    });
  };

  // ================= DELETE EXAM =================
  const handleDelete = async (id) => {

    // Confirm before delete
    if (!window.confirm("Delete this exam?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/exam/delete-exam/${id}`
      );
      alert("Exam Deleted");

      // Refresh exam list after delete
      getExams();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* HEADER SECTION */}
      <header className="exam-header">
        <h2>School Exam Portal</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="exam-container">
        <h2>Exam Management</h2>

        {/* CREATE / UPDATE FORM */}
        <form className="exam-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Exam Name"
            value={formData.name}
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
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          {/* Button text changes based on edit/create mode */}
          <button>
            {editId ? "Update Exam" : "Create Exam"}
          </button>
        </form>

        {/* EXAM LIST DISPLAY */}
        <div className="exam-grid">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.name}</h3>

              <p>
                <b>Class:</b>{" "}
                {exam.classId?.className || exam.classId?._id}
              </p>

              <p>
                <b>Start:</b>{" "}
                {exam.startDate?.split("T")[0]}
              </p>

              <p>
                <b>End:</b>{" "}
                {exam.endDate?.split("T")[0]}
              </p>

              {/* ACTION BUTTONS */}
              <div className="btn-group">
                <button
                  className="update-btn"
                  onClick={() => handleEdit(exam)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(exam._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <footer className="exam-footer">
        <p>© 2026 School Exam Management</p>
      </footer>
    </>
  );
};

export default StuExam;