import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherHomePage.css"; // Reuse styling for consistency

const AllTeacher = () => {
    const [teachers, setTeachers] = useState([]);

    const getTeachers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/teacher/get-teacher");
            setTeachers(res.data.teachers);
        } catch (error) {
            console.log("Error fetching teachers:", error);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    return (
        <>
            <header className="header">
                <h2>School Management - Teacher Data</h2>
                <nav>
                    <a href="/teacher-home">Back to Home</a>
                </nav>
            </header>

            <div className="teacher-container">
                <h2>All Teacher Details</h2>
                <div className="teacher-list">
                    {teachers.length > 0 ? (
                        teachers.map((t) => (
                            <div key={t._id} className="teacher-card">
                                <p><b>Subject:</b> {t.subject}</p>
                                <p><b>Department:</b> {t.department}</p>
                                <p><b>Qualification:</b> {t.qualification}</p>
                                <p><b>Hire Date:</b> {t.hireDate ? new Date(t.hireDate).toLocaleDateString() : "N/A"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No teachers found.</p>
                    )}
                </div>
            </div>

            <footer className="footer">
                <p>© 2026 School Management System</p>
            </footer>
        </>
    );
};

export default AllTeacher;
