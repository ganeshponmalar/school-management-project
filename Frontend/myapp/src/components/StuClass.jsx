import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StuClass.css";

const StuClass = () => {
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sections: ""
  });

  // GET ALL CLASSES
  const getClasses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/class/getAll-class"
      );
      setClasses(res.data.classes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getClasses();
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

    const payload = {
      name: formData.name,
      sections: formData.sections.split(",")
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/class/update-class/${editId}`,
          payload
        );
        alert("Class Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/class/create-class",
          payload
        );
        alert("Class Created Successfully");
      }

      setFormData({ name: "", sections: "" });
      setEditId(null);
      getClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // EDIT
  const handleEdit = (cls) => {
    setEditId(cls._id);

    setFormData({
      name: cls.name,
      sections: cls.sections.join(",")
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/class/delete-class/${id}`
      );
      alert("Class Deleted");
      getClasses();
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
          <a href="/class">Classes</a>
          <a href="/exam">Exams</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="class-container">
        <h2>Class Management</h2>

        {/* FORM */}
        <form className="class-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Class Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="sections"
            placeholder="Sections (A,B,C)"
            value={formData.sections}
            onChange={handleChange}
          />

          <button>
            {editId ? "Update Class" : "Create Class"}
          </button>
        </form>

        {/* CLASS LIST */}
        <div className="class-grid">
          {classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <h3>{cls.name}</h3>

              <p>
                <b>Sections:</b> {cls.sections?.join(", ")}
              </p>

              <div className="btn-group">
                <button
                  className="update-btn"
                  onClick={() => handleEdit(cls)}
                >
                  Update
                </button>

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

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 School Management System</p>
      </footer>
    </>
  );
};

export default StuClass;