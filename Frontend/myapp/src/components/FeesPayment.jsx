import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeesPayment.css";

const FeesHomePage = () => {
    const [fees, setFees] = useState([]);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        dueDate: "",
        paymentDate: ""
    });

    // GET ALL FEES
    const getFees = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/v1/fee/all-fee"
            );
            setFees(res.data.fees);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getFees();
    }, []);

    // INPUT CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await axios.put(
                    `http://localhost:5000/api/v1/fee/update-fee/${editId}`,
                    formData
                );
                alert("Fee Updated Successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/api/v1/fee/create-fee",
                    formData
                );
                alert("Fee Added Successfully");
            }

            setFormData({
                studentId: "",
                amount: "",
                dueDate: "",
                paymentDate: ""
            });

            setEditId(null);
            getFees();

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    // EDIT
    const handleEdit = (fee) => {
        setEditId(fee._id);
        setFormData({
            studentId: fee.studentId?._id || "",
            amount: fee.amount,
            dueDate: fee.dueDate?.split("T")[0],
            paymentDate: fee.paymentDate?.split("T")[0] || ""
        });
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this fee?")) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/v1/fee/delete-fee/${id}`
            );
            alert("Fee Deleted");
            getFees();
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <>
            {/* HEADER */}
            <header className="header">
                <h2>School Management</h2>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/service">Service</a>
                    <a href="/policy">Policy</a>
                </nav>
            </header>

            <div className="fees-container">
                <h2>Fees Management</h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="fees-form">

                    <input
                        name="studentId"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        {editId ? "Update Fee" : "Add Fee"}
                    </button>
                </form>

                {/* FEES LIST */}
                <h3>All Fees</h3>

                <div className="fees-list">
                    {fees.map((f) => (
                        <div key={f._id} className="fees-card">
                            <p><b>Student:</b> {f.studentId?.name || f.studentId?._id}</p>
                            <p><b>Amount:</b> ₹{f.amount}</p>
                            <p><b>Status:</b> {f.status}</p>
                            <p><b>Due:</b> {f.dueDate?.split("T")[0]}</p>

                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(f)}
                            >
                                Update
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(f._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <footer className="footer">
                <p>© 2026 School Management System</p>
            </footer>
        </>
    );
};

export default FeesHomePage;