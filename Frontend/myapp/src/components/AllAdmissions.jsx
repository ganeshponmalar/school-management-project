import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllAdmissions.css";
import { useAuth } from "../Context/AuthContext.jsx";

const AllAdmissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchAdmissions = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/admission/get-all", { withCredentials: true });
            setAdmissions(res.data.admissions || []);
        } catch (err) {
            console.error("Error fetching admissions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        if (user?.role !== "admin") return;

        try {
            await axios.put(
                `http://localhost:5000/api/v1/admission/update-status/${id}`,
                { status },
                { withCredentials: true }
            );
            alert(`Status updated to ${status}`);
            fetchAdmissions();
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admission record?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/v1/admission/delete-admission/${id}`, { withCredentials: true });
            alert("Record deleted");
            fetchAdmissions();
        } catch (err) {
            alert("Error deleting record");
        }
    };

    if (loading) return <div className="loading">Loading admissions...</div>;

    return (
        <div className="all-admissions-container">
            <h3>Admission Records</h3>
            {admissions.length === 0 ? (
                <p>No admission records found.</p>
            ) : (
                <div className="admissions-grid">
                    {admissions.map((adm) => (
                        <div key={adm._id} className="admission-card">
                            <h4>{adm.name}</h4>
                            <p><strong>Email:</strong> {adm.email}</p>
                            <p><strong>Phone:</strong> {adm.phone}</p>
                            <p><strong>Class:</strong> {adm.classId?.name}</p>
                            <p><strong>Group:</strong> {adm.section} Group</p>
                            <p><strong>Status:</strong> <span className={`status ${adm.status}`}>{adm.status}</span></p>
                            <p><strong>Father:</strong> {adm.fatherName}</p>
                            <p><strong>Mother:</strong> {adm.motherName}</p>

                            {user?.role === "admin" && (
                                <div className="admin-actions">
                                    <button className="approve-btn" onClick={() => handleStatusUpdate(adm._id, "approved")}>Approve</button>
                                    <button className="reject-btn" onClick={() => handleStatusUpdate(adm._id, "rejected")}>Reject</button>
                                    <button className="delete-btn" onClick={() => handleDelete(adm._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllAdmissions;
