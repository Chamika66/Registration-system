import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axiosInstance";

const EditStudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    japaneseLevel: "",
    gender: "male",
    phone: "",
    visaType: "student",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const student = res.data.student;
        setForm({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          birthday: student.birthday.split("T")[0], // Format date for input
          japaneseLevel: student.japaneseLevel,
          gender: student.gender,
          phone: student.phone,
          visaType: student.visaType,
          status: student.status,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student for editing", err);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/students/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/students/${id}`);
    } catch (err) {
      console.error("Failed to update student", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading student data...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {["firstName", "lastName", "email", "phone", "birthday"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type={field === "birthday" ? "date" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium">Japanese Level</label>
          <select
            name="japaneseLevel"
            value={form.japaneseLevel}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Level</option>
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="JLPT">JLPT</option>
            <option value="NAT">NAT</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Visa Type</label>
          <select
            name="visaType"
            value={form.visaType}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="student">Student</option>
            <option value="ssw">SSW</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentForm;
