import React, { useState } from "react";
import axios from "axios";
import "./SendNotification.css";

const SendNotification = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [recipientGroup, setRecipientGroup] = useState("all");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/v1/notification/send",
                { title, message, recipientGroup },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Notification sent successfully!");
                setTitle("");
                setMessage("");
                setRecipientGroup("all");
            }
        } catch (err) {
            console.error("Error sending notification:", err);
            alert(err.response?.data?.message || "Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="send-notification-container">
            <h3>Send Notification</h3>
            <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., School Holiday"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Recipient Group</label>
                    <select
                        value={recipientGroup}
                        onChange={(e) => setRecipientGroup(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="students">Students</option>
                        <option value="teachers">Teachers</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here..."
                        rows="5"
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading} className="send-btn">
                    {loading ? "Sending..." : "Send Notification"}
                </button>
            </form>
        </div>
    );
};

export default SendNotification;
