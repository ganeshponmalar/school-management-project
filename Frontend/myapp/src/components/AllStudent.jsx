import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHomePage.css"; // Reuse styling for consistency

const AllStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStudents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/student/get-allStudent", {
                withCredentials: true
            });
            if (res.data.success) {
                setStudents(res.data.students);
            }
        } catch (error) {
            console.log("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    return (
        <>
            <header className="header">
                <h2>School Management - Student Data</h2>
                <nav>
                    <a href="/admin-home">Back to Home</a>
                </nav>
            </header>

            <div className="teacher-container">
                <h2>All Student Details</h2>
                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <div className="teacher-list">
                        {students && students.length > 0 ? (
                            students.map((student) => (
                                <div key={student._id} className="teacher-card">
                                    <p><b>Name:</b> {student.name}</p>
                                    <p><b>Email:</b> {student.email}</p>
                                    <p><b>Phone:</b> {student.phone}</p>
                                    <p><b>Gender:</b> {student.gender}</p>
                                    <p><b>Address:</b> {student.address}</p>
                                    <p><b>Date of Birth:</b> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No students found.</p>
                        )}
                    </div>
                )}
            </div>

            <footer className="footer">
                <p>© 2026 School Management System</p>
            </footer>
        </>
    );
};

export default AllStudent;
