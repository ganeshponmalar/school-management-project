// Import React core and hooks for state + lifecycle management
import React, { useEffect, useState } from "react";

// Axios is used for API communication with backend server
import axios from "axios";

// CSS file for styling this component
import "./FeesPayment.css";

// Main Fees Management Component
const FeesHomePage = () => {

    // Stores all fee records fetched from backend
    const [fees, setFees] = useState([]);

    // Stores ID of fee being edited (null means create mode)
    const [editId, setEditId] = useState(null);

    // Form state for creating/updating fee details
    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        dueDate: "",
        paymentDate: ""
    });

    // ===============================
    // FETCH ALL FEES FROM BACKEND API
    // ===============================
    const getFees = async () => {
        try {
            // API call to fetch all fees
            const res = await axios.get(
                "http://localhost:5000/api/v1/fee/all-fee"
            );

            // Save fees data into state
            setFees(res.data.fees);
        } catch (error) {
            console.log(error);
        }
    };

    // Runs once when component loads
    useEffect(() => {
        getFees();
    }, []);

    // ===============================
    // HANDLE INPUT FIELD CHANGES
    // ===============================
    const handleChange = (e) => {
        setFormData({
            ...formData,               // keep previous form values
            [e.target.name]: e.target.value // update changed field
        });
    };

    // ===============================
    // CREATE NEW FEE OR UPDATE EXISTING
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload

        try {
            // If editId exists → update existing fee
            if (editId) {
                await axios.put(
                    `http://localhost:5000/api/v1/fee/update-fee/${editId}`,
                    formData
                );
                alert("Fee Updated Successfully");
            } 
            // Otherwise create new fee record
            else {
                await axios.post(
                    "http://localhost:5000/api/v1/fee/create-fee",
                    formData
                );
                alert("Fee Added Successfully");
            }

            // Reset form after submit
            setFormData({
                studentId: "",
                amount: "",
                dueDate: "",
                paymentDate: ""
            });

            // Exit edit mode
            setEditId(null);

            // Refresh fee list
            getFees();

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    // ===============================
    // EDIT FEE FUNCTION
    // Pre-fill form with existing data
    // ===============================
    const handleEdit = (fee) => {
        setEditId(fee._id);

        setFormData({
            studentId: fee.studentId?._id || "",
            amount: fee.amount,
            // Format MongoDB date to yyyy-mm-dd
            dueDate: fee.dueDate?.split("T")[0],
            paymentDate: fee.paymentDate?.split("T")[0] || ""
        });
    };

    // ===============================
    // DELETE FEE RECORD
    // ===============================
    const handleDelete = async (id) => {

        // Confirmation popup before deletion
        if (!window.confirm("Delete this fee?")) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/v1/fee/delete-fee/${id}`
            );

            alert("Fee Deleted");

            // Refresh fee list
            getFees();

        } catch {
            alert("Delete failed");
        }
    };

    // ===============================
    // UI RENDERING
    // ===============================
    return (
        <>
            {/* HEADER SECTION */}
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

                {/* CREATE / UPDATE FORM */}
                <form onSubmit={handleSubmit} className="fees-form">

                    {/* Student ID */}
                    <input
                        name="studentId"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    />

                    {/* Fee Amount */}
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />

                    {/* Due Date */}
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />

                    {/* Payment Date */}
                    <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                    />

                    {/* Button text changes based on edit mode */}
                    <button type="submit">
                        {editId ? "Update Fee" : "Add Fee"}
                    </button>
                </form>

                {/* DISPLAY ALL FEES */}
                <h3>All Fees</h3>

                <div className="fees-list">
                    {fees.map((f) => (
                        <div key={f._id} className="fees-card">

                            <p>
                                <b>Student:</b>
                                {f.studentId?.name || f.studentId?._id}
                            </p>

                            <p><b>Amount:</b> ₹{f.amount}</p>
                            <p><b>Status:</b> {f.status}</p>

                            <p>
                                <b>Due:</b>
                                {f.dueDate?.split("T")[0]}
                            </p>

                            {/* Edit Button */}
                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(f)}
                            >
                                Update
                            </button>

                            {/* Delete Button */}
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

            {/* FOOTER SECTION */}
            <footer className="footer">
                <p>© 2026 School Management System</p>
            </footer>
        </>
    );
};

export default FeesHomePage;