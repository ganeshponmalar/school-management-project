import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllAdmissions.css"; // Reuse table styles

const AllParents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/parent/admin/all", {
                    withCredentials: true,
                });
                setParents(res.data.parents);
            } catch (err) {
                console.error("Error fetching parents:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchParents();
    }, []);

    if (loading) return <div>Loading Parents...</div>;

    return (
        <div className="all-data-view">
            <h2>All Parents</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Child(ren)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {parents.length > 0 ? (
                        parents.map((p) => (
                            <tr key={p._id}>
                                <td>{p.userId?.name}</td>
                                <td>{p.userId?.email}</td>
                                <td>{p.userId?.phone}</td>
                                <td>
                                    {p.studentIds?.map(s => `Roll: ${s.rollNumber}`).join(", ") || "None"}
                                </td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No parents found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllParents;
