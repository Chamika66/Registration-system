import { useState } from "react";
import axios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddCoadminPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("/api/auth/add-coadmin", form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    alert("Co-Admin added successfully!");
    navigate("/dashboard");
  } catch (err) {
    console.error("Error adding co-admin", err?.response?.data || err.message);
    alert("Failed to add co-admin");
  }
};

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Co-Admin</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {["firstName", "lastName", "username", "email", "password"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Co-Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoadminPage;
