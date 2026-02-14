// Import React and hooks
// useState -> manage component state
// useEffect -> run side effects like API calls
import React, { useEffect, useState } from "react";

// Axios is used for HTTP requests to backend APIs
import axios from "axios";

// CSS file for styling class management page
import "./StuClass.css";

// Main Class Management Component
const StuClass = () => {

  // Store all class records fetched from backend
  const [classes, setClasses] = useState([]);

  // Store ID of class being edited
  // null means we are creating a new class
  const [editId, setEditId] = useState(null);

  // Form state for class creation/update
  const [formData, setFormData] = useState({
    name: "",
    sections: ""
  });

  // ======================================
  // FETCH ALL CLASSES FROM BACKEND
  // ======================================
  const getClasses = async () => {
    try {

      // API request to get all classes
      const res = await axios.get(
        "http://localhost:5000/api/v1/class/getAll-class"
      );

      // Store fetched classes in state
      setClasses(res.data.classes);

    } catch (err) {
      console.log(err);
    }
  };

  // Run once when component loads
  useEffect(() => {
    getClasses();
  }, []);

  // ======================================
  // HANDLE INPUT FIELD CHANGES
  // ======================================
  const handleChange = (e) => {

    // Spread operator keeps previous values
    // Only changed field gets updated
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ======================================
  // CREATE NEW CLASS OR UPDATE EXISTING
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Convert comma-separated sections string into array
    // Example: "A,B,C" -> ["A","B","C"]
    const payload = {
      name: formData.name,
      sections: formData.sections.split(",")
    };

    try {

      // If editId exists -> update class
      if (editId) {

        await axios.put(
          `http://localhost:5000/api/v1/class/update-class/${editId}`,
          payload
        );

        alert("Class Updated Successfully");

      } else {

        // Otherwise create new class
        await axios.post(
          "http://localhost:5000/api/v1/class/create-class",
          payload
        );

        alert("Class Created Successfully");
      }

      // Reset form after submission
      setFormData({ name: "", sections: "" });

      // Exit edit mode
      setEditId(null);

      // Refresh class list
      getClasses();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ======================================
  // EDIT CLASS
  // Pre-fill form with existing class data
  // ======================================
  const handleEdit = (cls) => {

    // Store selected class ID
    setEditId(cls._id);

    // Populate form with existing data
    setFormData({
      name: cls.name,

      // Convert array back to comma-separated string
      // Example: ["A","B"] -> "A,B"
      sections: cls.sections.join(",")
    });
  };

  // ======================================
  // DELETE CLASS RECORD
  // ======================================
  const handleDelete = async (id) => {

    // Confirm before deleting
    if (!window.confirm("Delete this class?")) return;

    try {

      // API call to delete class
      await axios.delete(
        `http://localhost:5000/api/v1/class/delete-class/${id}`
      );

      alert("Class Deleted");

      // Refresh class list
      getClasses();

    } catch {
      alert("Delete failed");
    }
  };

  // ======================================
  // UI RENDERING SECTION
  // ======================================
  return (
    <>
      {/* HEADER SECTION */}
      <header className="header">
        <h2>School Management</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/class">Classes</a>
          <a href="/exam">Exams</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="class-container">
        <h2>Class Management</h2>

        {/* CREATE / UPDATE FORM */}
        <form className="class-form" onSubmit={handleSubmit}>

          {/* Class Name Input */}
          <input
            name="name"
            placeholder="Class Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Sections Input (comma separated) */}
          <input
            name="sections"
            placeholder="Sections (A,B,C)"
            value={formData.sections}
            onChange={handleChange}
          />

          {/* Button text changes based on edit mode */}
          <button>
            {editId ? "Update Class" : "Create Class"}
          </button>
        </form>

        {/* DISPLAY CLASS LIST */}
        <div className="class-grid">
          {classes.map((cls) => (
            <div key={cls._id} className="class-card">

              {/* Class Name */}
              <h3>{cls.name}</h3>

              {/* Sections Display */}
              <p>
                <b>Sections:</b> {cls.sections?.join(", ")}
              </p>

              {/* Action Buttons */}
              <div className="btn-group">

                {/* Edit Button */}
                <button
                  className="update-btn"
                  onClick={() => handleEdit(cls)}
                >
                  Update
                </button>

                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(cls._id)}
                >
                  Delete
                </button>

              </div>
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

// Export component so it can be used in routing/pages
export default StuClass;