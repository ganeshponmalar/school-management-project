import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuExam.css";

const StuExam = () => {
  const [exams, setExams] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    startDate: "",
    endDate: ""
  });

  // GET ALL EXAMS
  const getExams = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/exam/get-all-exams"
      );
      setExams(res.data.exams);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/exam/update-exam/${editId}`,
          formData
        );
        alert("Exam Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/exam/create-exam",
          formData
        );
        alert("Exam Created Successfully");
      }

      setFormData({
        name: "",
        classId: "",
        startDate: "",
        endDate: ""
      });

      setEditId(null);
      getExams();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // EDIT
  const handleEdit = (exam) => {
    setEditId(exam._id);
    setFormData({
      name: exam.name,
      classId: exam.classId?._id || "",
      startDate: exam.startDate?.split("T")[0],
      endDate: exam.endDate?.split("T")[0]
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/exam/delete-exam/${id}`
      );
      alert("Exam Deleted");
      getExams();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="exam-header">
        <h2>School Exam Portal</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* MAIN */}
      <div className="exam-container">
        <h2>Exam Management</h2>

        {/* FORM */}
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

          <button>
            {editId ? "Update Exam" : "Create Exam"}
          </button>
        </form>

        {/* LIST */}
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

      {/* FOOTER */}
      <footer className="exam-footer">
        <p>© 2026 School Exam Management</p>
      </footer>
    </>
  );
};

export default StuExam;