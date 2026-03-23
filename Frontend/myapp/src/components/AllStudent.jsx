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
            return (
                (student.name && student.name.toLowerCase().includes(lowercasedTerm)) ||
                (student.email && student.email.toLowerCase().includes(lowercasedTerm)) ||
                (student.rollNumber && student.rollNumber.toLowerCase().includes(lowercasedTerm))
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
                                            <input type="text" name="name" value={editFormData.name || ""} onChange={handleEditChange} placeholder="Name" />
                                            <input type="email" name="email" value={editFormData.email || ""} onChange={handleEditChange} placeholder="Email" />
                                            <input type="text" name="phone" value={editFormData.phone || ""} onChange={handleEditChange} placeholder="Phone" />
                                            <input type="text" name="address" value={editFormData.address || ""} onChange={handleEditChange} placeholder="Address" />
                                            <div style={{ marginTop: '10px' }}>
                                                <button onClick={() => handleSave(student._id)} style={{ marginRight: '10px', padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '3px' }}>Save</button>
                                                <button onClick={handleCancel} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '3px' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display Details
                                        <>
                                            <p><b>Name:</b> {student.name}</p>
                                            <p><b>Email:</b> {student.email}</p>
                                            <p><b>Phone:</b> {student.phone}</p>
                                            <p><b>Gender:</b> {student.gender}</p>
                                            <p><b>Address:</b> {student.address}</p>
                                            <p><b>Date of Birth:</b> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}</p>
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
