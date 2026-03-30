import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentNotifications.css";

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/notification/my", {
                withCredentials: true,
            });
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return <div className="loading">Loading notifications...</div>;
    }

    return (
        <div className="notifications-container">
            <h3>Announcements & Messages</h3>
            {notifications.length === 0 ? (
                <p className="no-notifications">No notifications found.</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notif) => (
                        <div key={notif._id} className="notification-card">
                            <div className="notif-header">
                                <h4>{notif.title}</h4>
                                <span className="notif-date">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="notif-message">{notif.message}</p>
                            <div className="notif-footer">
                                <span className="notif-sender">From School Office</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentNotifications;
