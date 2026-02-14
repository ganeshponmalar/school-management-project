import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuResult.css";

const StuResult = () => {

    // Store all student results fetched from backend
    const [results, setResults] = useState([]);

    // Holds ID when editing a result (null = create mode)
    const [editId, setEditId] = useState(null);

    // Form state for creating/updating result
    const [formData, setFormData] = useState({
        studentId: "",
        examId: "",
        subject: "",
        marksObtained: "",
        totalMarks: "",
        grade: ""
    });

    /* =====================================================
       FETCH ALL RESULTS FROM BACKEND
       Called initially when component mounts and after
       create/update/delete operations.
    ====================================================== */
    const getResults = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/v1/result/all-results"
            );
            setResults(res.data.results);
        } catch (err) {
            console.log("Error fetching results:", err);
        }
    };

    // Run once on component load
    useEffect(() => {
        getResults();
    }, []);

    /* =====================================================
       HANDLE FORM INPUT CHANGE
       Updates only the changed field while preserving others
    ====================================================== */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /* =====================================================
       CREATE OR UPDATE RESULT
       - If editId exists → update existing result
       - Otherwise → create new result
    ====================================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                // Update existing result
                await axios.put(
                    `http://localhost:5000/api/v1/result/update-result/${editId}`,
                    formData
                );
                alert("Result Updated Successfully");
            } else {
                // Create new result
                await axios.post(
                    "http://localhost:5000/api/v1/result/create-result",
                    formData
                );
                alert("Result Created Successfully");
            }

            // Reset form after submission
            setFormData({
                studentId: "",
                examId: "",
                subject: "",
                marksObtained: "",
                totalMarks: "",
                grade: ""
            });

            setEditId(null); // switch back to create mode
            getResults();    // refresh result list

        } catch (err) {
            alert(err.response?.data?.message || "Error saving result");
        }
    };

    /* =====================================================
       EDIT RESULT
       Prefills form with selected result data
    ====================================================== */
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

    /* =====================================================
       DELETE RESULT
       Asks confirmation before deletion and refreshes list
    ====================================================== */
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
            {/* ================= HEADER SECTION ================= */}
            <header className="result-header">
                <h2>Student Result System</h2>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/service">Service</a>
                    <a href="/contact">Contact</a>
                </nav>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <div className="result-container">
                <h2>Result Management</h2>

                {/* RESULT FORM (CREATE / UPDATE) */}
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

                    {/* Button text switches based on edit mode */}
                    <button>
                        {editId ? "Update Result" : "Add Result"}
                    </button>
                </form>

                {/* ================= RESULT LIST ================= */}
                <div className="result-grid">
                    {results.map((r) => (
                        <div key={r._id} className="result-card">
                            <h3>{r.subject}</h3>

                            {/* Student Name (fallback to ID if not populated) */}
                            <p>
                                <b>Student:</b>{" "}
                                {r.studentId?.name || r.studentId?._id}
                            </p>

                            {/* Exam Name */}
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

                            {/* ACTION BUTTONS */}
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

            {/* ================= FOOTER ================= */}
            <footer className="result-footer">
                <p>© 2026 Student Result Portal</p>
            </footer>
        </>
    );
};

export default StuResult;