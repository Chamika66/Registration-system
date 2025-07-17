import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axiosInstance";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudent(res.data.student);
      } catch (err) {
        console.error("Failed to fetch student", err);
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return <p className="p-6 text-gray-500">Loading student details...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p><strong>Full Name:</strong> {student.fullName}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Birthday:</strong> {new Date(student.birthday).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Japanese Level:</strong> {student.japaneseLevel}</p>
        <p><strong>Visa Type:</strong> {student.visaType}</p>
        <p><strong>Status:</strong> {student.status}</p>
        {student.photograph && (
          <div className="mt-4">
            <strong>Photograph:</strong>
            <div className="mt-2">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${student.photograph}`}
                alt="Student"
                className="w-40 h-auto rounded border"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsPage;
