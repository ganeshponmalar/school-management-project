import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminHomePage.css"; // Reuse styling for consistency

const AllAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAdmins = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/user/all-users", {
                withCredentials: true // Assuming authentication is required
            });
            if (res.data.success) {
                // Filter users with role "admin"
                const adminUsers = res.data.users.filter(u => u.role === "admin");
                setAdmins(adminUsers);
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
                {loading ? (
                    <p>Loading admins...</p>
                ) : (
                    <div className="teacher-list">
                        {admins.length > 0 ? (
                            admins.map((admin) => (
                                <div key={admin._id} className="teacher-card">
                                    <p><b>Name:</b> {admin.name}</p>
                                    <p><b>Email:</b> {admin.email}</p>
                                    <p><b>Phone:</b> {admin.phone}</p>
                                    <p><b>Gender:</b> {admin.gender}</p>
                                    <p><b>Address:</b> {admin.address}</p>
                                    <p><b>Date of Birth:</b> {admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString() : "N/A"}</p>
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
