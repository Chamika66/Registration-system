import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ConfirmModel"; // ✅ Make sure the path is correct
import axios from "../services/axiosInstance";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  if (!student) {
    return <p className="p-6 text-gray-500">Loading student details...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>

      {/* Student Photograph */}
      {student.photograph && (
        <div className="flex justify-center mb-6">
          <img
            src={`${import.meta.env.VITE_API_BACKEND_URL}/uploads/${student.photograph}`}
            alt="Student"
            className="w-48 h-auto rounded-lg border shadow"
          />
        </div>
      )}

      {/* Student Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Full Name:</strong> {student.fullName}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Birthday:</strong> {new Date(student.birthday).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Japanese Level:</strong> {student.japaneseLevel}</p>
          <p><strong>Visa Type:</strong> {student.visaType}</p>
          <p><strong>Status:</strong> {student.status}</p>
        </div>
      </div>

      {/* Record Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="font-semibold text-lg mb-3">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Created By:</strong>{" "}
            {student.createdBy
              ? `${student.createdBy.firstName} ${student.createdBy.lastName} (${student.createdBy.username})`
              : "N/A"}
          </p>
          <p>
            <strong>Updated By:</strong>{" "}
            {student.updatedBy
              ? `${student.updatedBy.firstName} ${student.updatedBy.lastName} (${student.updatedBy.username})`
              : "N/A"}
          </p>
          <p><strong>Created At:</strong> {new Date(student.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(student.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/edit-student/${student._id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirmModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};

export default StudentDetailsPage;
