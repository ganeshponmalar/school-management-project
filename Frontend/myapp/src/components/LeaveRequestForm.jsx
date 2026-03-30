import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveRequestForm.css";

const LeaveRequestForm = () => {
    const [formData, setFormData] = useState({
        leaveType: "Sick Leave",
        fromDate: "",
        toDate: "",
        reason: "",
    });
    const [myLeaves, setMyLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/leave/my", {
                withCredentials: true,
            });
            if (res.data.success) {
                setMyLeaves(res.data.leaves);
            }
        } catch (err) {
            console.error("Error fetching my leaves:", err);
        }
    };

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/v1/leave/request",
                formData,
                { withCredentials: true }
            );
            if (res.data.success) {
                alert("Leave request submitted successfully");
                setFormData({
                    leaveType: "Sick Leave",
                    fromDate: "",
                    toDate: "",
                    reason: "",
                });
                fetchMyLeaves();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leave-management-container">
            <h3>Leave Management</h3>
            <div className="leave-form-section">
                <h4>Request Leave</h4>
                <form onSubmit={handleSubmit} className="leave-form">
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                        >
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Emergency Leave">Emergency Leave</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Reason</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Briefly explain the reason for leave..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="submit-leave-btn">
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </div>

            <div className="leave-history-section">
                <h4>My Leave Requests</h4>
                {myLeaves.length === 0 ? (
                    <p className="no-leaves">No leave requests found.</p>
                ) : (
                    <div className="leave-list">
                        {myLeaves.map((leave) => (
                            <div key={leave._id} className={`leave-item-card ${leave.status.toLowerCase()}`}>
                                <div className="leave-info">
                                    <span className="leave-tag">{leave.leaveType}</span>
                                    <span className="leave-dates">
                                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="leave-reason">{leave.reason}</p>
                                <div className="leave-status">
                                    Status: <span className={`status-label ${leave.status.toLowerCase()}`}>{leave.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveRequestForm;
