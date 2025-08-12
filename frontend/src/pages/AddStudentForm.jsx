import { useState } from "react";
import axios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AddStudentForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    japaneseLevel: "",
    gender: "male",
    phone: "",
    photograph: null,
    visaType: "",
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post("/api/students", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Student added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to add student", error);
      alert("Failed to add student");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Birthday</label>
          <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Japanese Level</label>
          <select name="japaneseLevel" value={formData.japaneseLevel} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select level</option>
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">JFT</option>
            <option value="JLPT">JLPT</option>
            <option value="NAT">NAT</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Parents Name</label>
          <input name="parentsName" value={formData.parentsName} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Parents Phone</label>
          <input name="parentsPhone" value={formData.parentsPhone} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Photograph</label>
          <input type="file" name="photograph" onChange={handleChange} accept="image/*" required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Visa Type</label>
          <select name="visaType" value={formData.visaType} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select visa</option>
            <option value="student">Student Visa</option>
            <option value="ssw">SSW Visa</option>
            <option value="other">Training Visa</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
