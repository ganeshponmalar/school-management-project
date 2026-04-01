import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ParentHomePage.css"; // Reuse dashboard styles

const ParentAttendance = () => {
    const { studentId } = useParams();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/parent/student/attendance/${studentId}`, {
                    withCredentials: true,
                });
                setAttendance(res.data.attendance);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [studentId]);

    if (loading) return <div className="loading">Loading Attendance...</div>;

    return (
        <div className="parent-feature-view">
            <header className="feature-header">
                <Link to="/parent-home" className="back-link">← Back to Dashboard</Link>
                <h2>Attendance Report</h2>
            </header>

            <div className="feature-content">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length > 0 ? (
                            attendance.map((item) => (
                                <tr key={item._id} className={item.status.toLowerCase()}>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParentAttendance;
