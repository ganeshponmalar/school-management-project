import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveApproval.css";

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/leave/all", {
                withCredentials: true,
            });
            if (res.data.success) {
                setLeaves(res.data.leaves);
            }
        } catch (err) {
            console.error("Error fetching all leaves:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/v1/leave/update/${id}`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                alert(`Leave request ${status} successfully`);
                fetchAllLeaves();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) {
        return <div className="loading">Loading leave requests...</div>;
    }

    return (
        <div className="admin-leave-container">
            <h3>Admin Leave Management</h3>
            {leaves.length === 0 ? (
                <p className="no-leaves">No leave requests to show.</p>
            ) : (
                <div className="leave-requests-table-wrapper">
                    <table className="leave-requests-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Role</th>
                                <th>Leave Type</th>
                                <th>From - To</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id} className={leave.status.toLowerCase()}>
                                    <td>
                                        <div className="applicant-info">
                                            <span className="applicant-name">{leave.applicant?.name}</span>
                                            <span className="applicant-email">{leave.applicant?.email}</span>
                                        </div>
                                    </td>
                                    <td><span className={`role-badge ${leave.applicant?.role}`}>{leave.applicant?.role}</span></td>
                                    <td>{leave.leaveType}</td>
                                    <td>
                                        {new Date(leave.fromDate).toLocaleDateString()} - <br />
                                        {new Date(leave.toDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="reason-cell" title={leave.reason}>
                                            {leave.reason}
                                        </div>
                                    </td>
                                    <td><span className={`status-pill ${leave.status.toLowerCase()}`}>{leave.status}</span></td>
                                    <td>
                                        {leave.status === "Pending" ? (
                                            <div className="table-actions">
                                                <button className="approve-link-btn" onClick={() => handleStatusUpdate(leave._id, "Approved")}>Approve</button>
                                                <button className="reject-link-btn" onClick={() => handleStatusUpdate(leave._id, "Rejected")}>Reject</button>
                                            </div>
                                        ) : (
                                            <span className="responded-text">Responded</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveApproval;
