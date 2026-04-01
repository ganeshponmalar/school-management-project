import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHomePage.css"; // Reuse styling for consistency
import SearchBar from "./SearchBar";

const AllStudent = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [editStudentId, setEditStudentId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const getStudents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/student/get-allStudent", {
                withCredentials: true
            });
            if (res.data.success) {
                setStudents(res.data.students);
                setFilteredStudents(res.data.students);
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

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredStudents(students);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = students.filter((student) => {
            const name = student.userId?.name || "";
            const email = student.userId?.email || "";
            const roll = student.rollNumber ? student.rollNumber.toString() : "";
            return (
                name.toLowerCase().includes(lowercasedTerm) ||
                email.toLowerCase().includes(lowercasedTerm) ||
                roll.toLowerCase().includes(lowercasedTerm)
            );
        });
        setFilteredStudents(filtered);
    };

    const handleEditClick = (student) => {
        setEditStudentId(student._id);
        setEditFormData(student);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSave = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/v1/student/update/${id}`, editFormData, {
                withCredentials: true
            });

            if (res.data.success) {
                // Optimistic UI update
                const updatedStudents = students.map((s) => (s._id === id ? res.data.student : s));
                setStudents(updatedStudents);
                setFilteredStudents(updatedStudents);
                setEditStudentId(null);
            }
        } catch (error) {
            console.log("Error updating student:", error);
            alert("Failed to update student.");
        }
    };

    const handleCancel = () => {
        setEditStudentId(null);
        setEditFormData({});
    };

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

                <SearchBar onSearch={handleSearch} placeholder="Search students by name, email, or roll number..." />

                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <div className="teacher-list">
                        {filteredStudents && filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div key={student._id} className="teacher-card">
                                    {editStudentId === student._id ? (
                                        // Edit Form
                                        <div className="edit-form-inline">
                                            <input type="text" name="name" value={editFormData.userId?.name || ""} onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, name: e.target.value } })} placeholder="Name" />
                                            <input type="text" name="rollNumber" value={editFormData.rollNumber || ""} onChange={handleEditChange} placeholder="Roll Number" />
                                            <input type="email" name="email" value={editFormData.userId?.email || ""} onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, email: e.target.value } })} placeholder="Email" />
                                            <input type="text" name="phone" value={editFormData.userId?.phone || ""} onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, phone: e.target.value } })} placeholder="Phone" />
                                            <div style={{ marginTop: '10px' }}>
                                                <button onClick={() => handleSave(student._id)} style={{ marginRight: '10px', padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '3px' }}>Save</button>
                                                <button onClick={handleCancel} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '3px' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display Details
                                        <>
                                            <p><b>Roll Number:</b> <span style={{ color: '#ff4757', fontWeight: 'bold' }}>{student.rollNumber}</span></p>
                                            <p><b>Name:</b> {student.userId?.name || "Unlinked Student"}</p>
                                            <p><b>Guardian Name:</b> {student.guardianInfo?.name}</p>
                                            <p><b>Email:</b> {student.userId?.email || "N/A"}</p>
                                            <p><b>Phone:</b> {student.userId?.phone || student.guardianInfo?.phone}</p>
                                            <p><b>Gender:</b> {student.userId?.gender || "N/A"}</p>
                                            <p><b>Address:</b> {student.userId?.address || "N/A"}</p>
                                            <p><b>Admission Date:</b> {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "N/A"}</p>
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                style={{ marginTop: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
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
