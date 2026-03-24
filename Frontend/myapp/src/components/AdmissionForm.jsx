import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdmissionForm.css";

const AdmissionForm = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        classId: "",
        section: "",
        fatherName: "",
        motherName: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchClassesAndUsers = async () => {
            try {
                const classRes = await axios.get("http://localhost:5000/api/v1/class/getAll-class", { withCredentials: true });
                setClasses(classRes.data.classes || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchClassesAndUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/v1/admission/create-admission",
                formData,
                { withCredentials: true }
            );
            setMessage("Admission record created successfully!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                gender: "",
                dateOfBirth: "",
                address: "",
                classId: "",
                section: "",
                fatherName: "",
                motherName: ""
            });
        } catch (err) {
            setMessage(err.response?.data?.message || "Error creating admission record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admission-form-container">
            <h3>New Admission Admission</h3>
            <form onSubmit={handleSubmit} className="admission-form">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <select name="class_info" onChange={(e) => {
                    const [cId, sec] = e.target.value.split("|");
                    
                    setFormData({ ...formData, classId: cId, section: sec });

                }} required>
                    <option value="">Select Class & Group</option>
                    {classes.map((cls) => (
                        cls.sections.map((sec) => (
                            <option key={`${cls._id}-${sec}`} value={`${cls._id}|${sec}`}>
                                {formData.name || "Student"} - {cls.name} - {sec} Group
                            </option>
                        ))
                    ))}
                </select>
                <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} required />
                <input type="text" name="motherName" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Admission"}</button>
            </form>
            {message && <p className="status-message">{message}</p>}
        </div>
    );
};

export default AdmissionForm;
