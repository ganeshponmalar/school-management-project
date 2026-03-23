import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHomePage.css"; // Reuse styling for consistency
import SearchBar from "./SearchBar";

const AllAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [editAdminId, setEditAdminId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const getAdmins = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/user/all-users", {
                withCredentials: true // Assuming authentication is required
            });
            if (res.data.success) {
                // Filter users with role "admin"
                const adminUsers = res.data.users.filter(u => u.role === "admin");
                setAdmins(adminUsers);
                setFilteredAdmins(adminUsers);
            }
        } catch (error) {
            console.log("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAdmins();
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredAdmins(admins);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = admins.filter((admin) => {
            return (
                (admin.name && admin.name.toLowerCase().includes(lowercasedTerm)) ||
                (admin.email && admin.email.toLowerCase().includes(lowercasedTerm))
            );
        });
        setFilteredAdmins(filtered);
    };

    const handleEditClick = (admin) => {
        setEditAdminId(admin._id);
        setEditFormData(admin);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSave = async (id) => {
        try {
            // Include withCredentials if the backend requires authentication
            const res = await axios.put(`http://localhost:5000/api/v1/user/update-user/${id}`, editFormData, {
                withCredentials: true
            });

            if (res.data.success) {
                // Optimistic UI update
                const updatedAdmins = admins.map((a) => (a._id === id ? res.data.user : a));
                setAdmins(updatedAdmins);
                setFilteredAdmins(updatedAdmins);
                setEditAdminId(null);
            }
        } catch (error) {
            console.log("Error updating admin:", error);
            alert("Failed to update admin.");
        }
    };

    const handleCancel = () => {
        setEditAdminId(null);
        setEditFormData({});
    };

    return (
        <>
            <header className="header">
                <h2>School Management - Admin Data</h2>
                <nav>
                    <a href="/admin-home">Back to Home</a>
                </nav>
            </header>

            <div className="teacher-container">
                <h2>All Admin Details</h2>

                <SearchBar onSearch={handleSearch} placeholder="Search admins by name or email..." />

                {loading ? (
                    <p>Loading admins...</p>
                ) : (
                    <div className="teacher-list">
                        {filteredAdmins.length > 0 ? (
                            filteredAdmins.map((admin) => (
                                <div key={admin._id} className="teacher-card">
                                    {editAdminId === admin._id ? (
                                        // Edit Form
                                        <div className="edit-form-inline">
                                            <input type="text" name="name" value={editFormData.name || ""} onChange={handleEditChange} placeholder="Name" />
                                            <input type="email" name="email" value={editFormData.email || ""} onChange={handleEditChange} placeholder="Email" />
                                            <input type="text" name="phone" value={editFormData.phone || ""} onChange={handleEditChange} placeholder="Phone" />
                                            <input type="text" name="address" value={editFormData.address || ""} onChange={handleEditChange} placeholder="Address" />
                                            <div style={{ marginTop: '10px' }}>
                                                <button onClick={() => handleSave(admin._id)} style={{ marginRight: '10px', padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '3px' }}>Save</button>
                                                <button onClick={handleCancel} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '3px' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p><b>Name:</b> {admin.name}</p>
                                            <p><b>Email:</b> {admin.email}</p>
                                            <p><b>Phone:</b> {admin.phone}</p>
                                            <p><b>Gender:</b> {admin.gender}</p>
                                            <p><b>Address:</b> {admin.address}</p>
                                            <p><b>Date of Birth:</b> {admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                                            <button
                                                onClick={() => handleEditClick(admin)}
                                                style={{ marginTop: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No admins found.</p>
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

export default AllAdmin;

