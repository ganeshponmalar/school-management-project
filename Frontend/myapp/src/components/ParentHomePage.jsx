import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ParentNotifications from "./ParentNotifications";
import "./ParentHomePage.css";

const ParentHomePage = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLinkFields, setShowLinkFields] = useState(false);
    const [linkFormData, setLinkFormData] = useState({ studentRollNumber: "", studentPhone: "" });

    const fetchMyStudents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/parent/my-students", {
                withCredentials: true,
            });
            setStudents(res.data.students);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyStudents();
    }, []);

    const handleLinkStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/v1/parent/link-student", linkFormData, {
                withCredentials: true,
            });
            alert(res.data.message);
            setLinkFormData({ studentRollNumber: "", studentPhone: "" });
            setShowLinkFields(false);
            fetchMyStudents(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to link student");
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="parent-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Parent Portal</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
                <div className="header-right">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="students-section">
                    <h2>My Children</h2>
                    <div className="students-grid">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <div key={student._id} className="student-card">
                                    <div className="student-info">
                                        <h3>{student.userId?.name}</h3>
                                        <p>Roll No: {student.rollNumber}</p>
                                        <p>Section: {student.section}</p>
                                    </div>
                                    <div className="features-grid">
                                        <Link to={`/parent/attendance/${student._id}`} className="feature-link">
                                            <div className="feature-item">
                                                <span>📅</span>
                                                <p>Attendance</p>
                                            </div>
                                        </Link>
                                        <Link to={`/parent/marks/${student._id}`} className="feature-link">
                                            <div className="feature-item">
                                                <span>📝</span>
                                                <p>Marks/Results</p>
                                            </div>
                                        </Link>
                                        <Link to={`/parent/fees/${student._id}`} className="feature-link">
                                            <div className="feature-item">
                                                <span>💰</span>
                                                <p>Fees</p>
                                            </div>
                                        </Link>
                                        <Link to={`/parent/communication/${student._id}`} className="feature-link">
                                            <div className="feature-item">
                                                <span>💬</span>
                                                <p>Teacher Chat</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No students linked to this account.</p>
                        )}
                    </div>
                </section>
                <section className="link-student-section">
                    {!showLinkFields ? (
                        <button className="add-child-btn" onClick={() => setShowLinkFields(true)}>
                            + Link Another Child
                        </button>
                    ) : (
                        <div className="link-form-container">
                            <h3>Link Your Child</h3>
                            <form onSubmit={handleLinkStudent}>
                                <input
                                    type="text"
                                    placeholder="Child's Roll Number"
                                    value={linkFormData.studentRollNumber}
                                    onChange={(e) => setLinkFormData({ ...linkFormData, studentRollNumber: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Guardian Phone (Verification)"
                                    value={linkFormData.studentPhone}
                                    onChange={(e) => setLinkFormData({ ...linkFormData, studentPhone: e.target.value })}
                                    required
                                />
                                <div className="form-actions">
                                    <button type="submit" className="link-btn">Link Student</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowLinkFields(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>

                <section className="notifications-section">
                    <ParentNotifications />
                </section>
            </main>
        </div>
    );
};

export default ParentHomePage;
