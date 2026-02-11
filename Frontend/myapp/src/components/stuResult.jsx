import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuResult.css";

const StuResult = () => {
    const [results, setResults] = useState([]);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        examId: "",
        subject: "",
        marksObtained: "",
        totalMarks: "",
        grade: ""
    });

    // GET ALL RESULTS
    const getResults = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/v1/result/all-results"
            );
            setResults(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getResults();
    }, []);

    // INPUT CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // CREATE / UPDATE RESULT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await axios.put(
                    `http://localhost:5000/api/v1/result/update-result/${editId}`,
                    formData
                );
                alert("Result Updated Successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/api/v1/result/create-result",
                    formData
                );
                alert("Result Created Successfully");
            }

            setFormData({
                studentId: "",
                examId: "",
                subject: "",
                marksObtained: "",
                totalMarks: "",
                grade: ""
            });

            setEditId(null);
            getResults();

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    // EDIT RESULT
    const handleEdit = (result) => {
        setEditId(result._id);
        setFormData({
            studentId: result.studentId?._id || "",
            examId: result.examId?._id || "",
            subject: result.subject,
            marksObtained: result.marksObtained,
            totalMarks: result.totalMarks,
            grade: result.grade
        });
    };

    // DELETE RESULT
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this result?")) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/v1/result/delete-result/${id}`
            );
            alert("Result Deleted");
            getResults();
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <>
            {/* HEADER */}
            <header className="result-header">
                <h2>Student Result System</h2>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/service">Service</a>
                    <a href="/contact">Contact</a>
                </nav>
            </header>

            <div className="result-container">
                <h2>Result Management</h2>

                {/* FORM */}
                <form className="result-form" onSubmit={handleSubmit}>
                    <input
                        name="studentId"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="examId"
                        placeholder="Exam ID"
                        value={formData.examId}
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
                        type="number"
                        name="marksObtained"
                        placeholder="Marks Obtained"
                        value={formData.marksObtained}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="totalMarks"
                        placeholder="Total Marks"
                        value={formData.totalMarks}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="grade"
                        placeholder="Grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                    />

                    <button>
                        {editId ? "Update Result" : "Add Result"}
                    </button>
                </form>

                {/* RESULTS LIST */}
                <div className="result-grid">
                    {results.map((r) => (
                        <div key={r._id} className="result-card">
                            <h3>{r.subject}</h3>

                            <p>
                                <b>Student:</b>{" "}
                                {r.studentId?.name || r.studentId?._id}
                            </p>

                            <p>
                                <b>Exam:</b>{" "}
                                {r.examId?.name || r.examId?._id}
                            </p>

                            <p>
                                <b>Marks:</b> {r.marksObtained}/{r.totalMarks}
                            </p>

                            <p>
                                <b>Grade:</b> {r.grade}
                            </p>

                            <div className="btn-group">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(r)}
                                >
                                    Update
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(r._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <footer className="result-footer">
                <p>© 2026 Student Result Portal</p>
            </footer>
        </>
    );
};

export default StuResult;