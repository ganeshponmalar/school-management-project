import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ParentHomePage.css";

const ParentMarks = () => {
    const { studentId } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/parent/student/marks/${studentId}`, {
                    withCredentials: true,
                });
                setResults(res.data.results);
            } catch (err) {
                console.error("Error fetching marks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMarks();
    }, [studentId]);

    if (loading) return <div className="loading">Loading Marks...</div>;

    return (
        <div className="parent-feature-view">
            <header className="feature-header">
                <Link to="/parent-home" className="back-link">← Back to Dashboard</Link>
                <h2>Exam Results</h2>
            </header>

            <div className="feature-content">
                <div className="results-grid">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <div key={result._id} className="result-card">
                                <h3>{result.examId?.name || "Exam"}</h3>
                                <p>Subject: {result.subject}</p>
                                <div className="score-badge">
                                    <span className="marks">{result.marksObtained}</span>
                                    <span className="total">/ {result.totalMarks}</span>
                                </div>
                                <p className="grade">Grade: {result.grade}</p>
                            </div>
                        ))
                    ) : (
                        <p>No marks/results recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentMarks;
