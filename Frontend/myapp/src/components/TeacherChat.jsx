import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ParentHomePage.css"; // Reuse some styles

const TeacherChat = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [parent, setParent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParent = async () => {
        if (!rollNumber) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/parent/teacher/find-parent?rollNumber=${rollNumber}`, {
                withCredentials: true,
            });
            setParent(res.data.parent);
            fetchMessages(res.data.parent.userId._id);
        } catch (err) {
            alert(err.response?.data?.message || "Parent not found");
            setParent(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (parentUserId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/parent/messages?otherUserId=${parentUserId}`, {
                withCredentials: true,
            });
            setMessages(res.data.messages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !parent) return;

        try {
            await axios.post("http://localhost:5000/api/v1/parent/message/send", {
                receiverId: parent.userId._id,
                studentId: parent.studentIds[0], // Simplified for now
                message: newMessage,
            }, { withCredentials: true });

            setNewMessage("");
            fetchMessages(parent.userId._id);
        } catch (err) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="teacher-chat-container" style={{ padding: "20px" }}>
            <h2>Chat with Parent</h2>
            <div className="search-box" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Enter Student Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                <button onClick={searchParent} className="chat-btn" disabled={loading}>
                    {loading ? "Searching..." : "Search Parent"}
                </button>
            </div>

            {parent && (
                <div className="chat-box" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <h3>Chatting with {parent.userId.name} (Parent of Student {rollNumber})</h3>
                    <div className="messages-list" style={{ height: "300px", overflowY: "auto", marginBottom: "20px", border: "1px solid #eee", padding: "10px" }}>
                        {messages.map((m, idx) => (
                            <div key={idx} style={{ textAlign: m.senderId === parent.userId._id ? "left" : "right", margin: "10px 0" }}>
                                <span style={{
                                    background: m.senderId === parent.userId._id ? "#f1f1f1" : "#e3f2fd",
                                    padding: "8px 12px",
                                    borderRadius: "15px",
                                    display: "inline-block"
                                }}>
                                    {m.message}
                                </span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                        <button type="submit" className="chat-btn">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherChat;
