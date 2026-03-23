import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherHomePage.css"; // Reuse styling for consistency
import SearchBar from "./SearchBar";

const AllTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [editTeacherId, setEditTeacherId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const getTeachers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/teacher/get-teacher");
            if (res.data.teachers) {
                setTeachers(res.data.teachers);
                setFilteredTeachers(res.data.teachers);
            }
        } catch (error) {
            console.log("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredTeachers(teachers);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = teachers.filter((t) => {
            return (
                (t.subject && t.subject.toLowerCase().includes(lowercasedTerm)) ||
                (t.department && t.department.toLowerCase().includes(lowercasedTerm)) ||
                (t.qualification && t.qualification.toLowerCase().includes(lowercasedTerm))
            );
        });
        setFilteredTeachers(filtered);
    };

    const handleEditClick = (teacher) => {
        setEditTeacherId(teacher._id);
        setEditFormData(teacher);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSave = async (id) => {
        try {
            // Include withCredentials if the backend requires authentication
            const res = await axios.put(`http://localhost:5000/api/v1/teacher/update/${id}`, editFormData, {
                withCredentials: true
            });

            if (res.data.success) {
                // Optimistic UI update
                const updatedTeachers = teachers.map((t) => (t._id === id ? res.data.teacher : t));
                setTeachers(updatedTeachers);
                setFilteredTeachers(updatedTeachers);
                setEditTeacherId(null);
            }
        } catch (error) {
            console.log("Error updating teacher:", error);
            alert("Failed to update teacher.");
        }
    };

    const handleCancel = () => {
        setEditTeacherId(null);
        setEditFormData({});
    };

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

                <SearchBar onSearch={handleSearch} placeholder="Search teachers by subject, department, or qualification..." />

                {loading ? (
                    <p>Loading teachers...</p>
                ) : (
                    <div className="teacher-list">
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((t) => (
                                <div key={t._id} className="teacher-card">
                                    {editTeacherId === t._id ? (
                                        // Edit Form
                                        <div className="edit-form-inline">
                                            <input type="text" name="subject" value={editFormData.subject || ""} onChange={handleEditChange} placeholder="Subject" />
                                            <input type="text" name="department" value={editFormData.department || ""} onChange={handleEditChange} placeholder="Department" />
                                            <input type="text" name="qualification" value={editFormData.qualification || ""} onChange={handleEditChange} placeholder="Qualification" />
                                            <div style={{ marginTop: '10px' }}>
                                                <button onClick={() => handleSave(t._id)} style={{ marginRight: '10px', padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '3px' }}>Save</button>
                                                <button onClick={handleCancel} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '3px' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p><b>Subject:</b> {t.subject}</p>
                                            <p><b>Department:</b> {t.department}</p>
                                            <p><b>Qualification:</b> {t.qualification}</p>
                                            <p><b>Hire Date:</b> {t.hireDate ? new Date(t.hireDate).toLocaleDateString() : "N/A"}</p>
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                style={{ marginTop: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No teachers found.</p>
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

export default AllTeacher;

