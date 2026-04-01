import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ParentHomePage.css";

const ParentCommunication = () => {
    const { studentId } = useParams();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const fetchMessages = async (teacherUserId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/parent/messages?studentId=${studentId}&otherUserId=${teacherUserId}`, {
                withCredentials: true,
            });
            setMessages(res.data.messages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/parent/student/teachers/${studentId}`, {
                    withCredentials: true,
                });
                setTeachers(res.data.teachers);
                if (res.data.teachers.length > 0) {
                    setSelectedTeacher(res.data.teachers[0]);
                    fetchMessages(res.data.teachers[0].userId._id);
                }
            } catch (err) {
                console.error("Error fetching teachers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [studentId]);

    if (loading) return <div className="loading">Loading teacher info...</div>;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTeacher) return;

        try {
            await axios.post("http://localhost:5000/api/v1/parent/message/send", {
                receiverId: selectedTeacher.userId._id,
                studentId,
                message: newMessage,
            }, { withCredentials: true });

            setNewMessage("");
            fetchMessages(selectedTeacher.userId._id);
        } catch (err) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="parent-feature-view">
            <div className="feature-header">
                <Link to="/parent-home" className="back-link">← Back to Dashboard</Link>
                <h1>Teacher Communication</h1>
            </div>

            <div className="feature-content" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
                <div className="teachers-sidebar">
                    <h3>Class Teachers</h3>
                    <div className="teachers-list">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher._id}
                                className={`teacher-item-card ${selectedTeacher?._id === teacher._id ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedTeacher(teacher);
                                    fetchMessages(teacher.userId._id);
                                }}
                                style={{
                                    padding: "15px",
                                    border: "1px solid #eee",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    background: selectedTeacher?._id === teacher._id ? "#e3f2fd" : "white"
                                }}
                            >
                                <strong>{teacher.userId?.name}</strong>
                                <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#666" }}>{teacher.subject} ({teacher.department})</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-window" style={{ background: "#f9f9f9", borderRadius: "10px", display: "flex", flexDirection: "column", height: "500px" }}>
                    {selectedTeacher ? (
                        <>
                            <div className="chat-header" style={{ padding: "15px", borderBottom: "1px solid #eee", background: "white", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                                <strong>Chat with {selectedTeacher.userId?.name}</strong>
                            </div>
                            <div className="messages-display" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                                {messages.map((m, idx) => (
                                    <div key={idx} style={{ textAlign: m.senderId === selectedTeacher.userId._id ? "left" : "right", margin: "10px 0" }}>
                                        <span style={{
                                            background: m.senderId === selectedTeacher.userId._id ? "white" : "#1a237e",
                                            color: m.senderId === selectedTeacher.userId._id ? "black" : "white",
                                            padding: "10px 15px",
                                            borderRadius: "15px",
                                            display: "inline-block",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                                        }}>
                                            {m.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <form className="message-form" onSubmit={handleSendMessage} style={{ padding: "15px", background: "white", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                                />
                                <button type="submit" className="chat-btn" style={{ margin: 0 }}>Send</button>
                            </form>
                        </>
                    ) : (
                        <p>No teachers found for this student's class.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentCommunication;
