import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ParentHomePage.css";

const ParentFees = () => {
    const { studentId } = useParams();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/parent/student/fees/${studentId}`, {
                    withCredentials: true,
                });
                setFees(res.data.fees);
            } catch (err) {
                console.error("Error fetching fees:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, [studentId]);

    if (loading) return <div className="loading">Loading Fees...</div>;

    return (
        <div className="parent-feature-view">
            <header className="feature-header">
                <Link to="/parent-home" className="back-link">← Back to Dashboard</Link>
                <h2>Fee Details</h2>
            </header>

            <div className="feature-content">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Invoice Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.length > 0 ? (
                            fees.map((fee) => (
                                <tr key={fee._id}>
                                    <td>{new Date(fee.createdAt).toLocaleDateString()}</td>
                                    <td>{fee.description || "School Fees"}</td>
                                    <td>${fee.amount}</td>
                                    <td className={fee.status.toLowerCase()}>
                                        <span className={`status-badge ${fee.status.toLowerCase()}`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No fee records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParentFees;
