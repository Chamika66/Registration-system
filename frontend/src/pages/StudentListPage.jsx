import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";

const StudentListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter") || "all";

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/api/students?filter=${filter}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudents(res.data.students);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };

    fetchStudents();
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {filter === "all"
          ? "All Students"
          : `Students with "${filter}" Status`}
      </h1>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student._id}
              className="border p-3 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/students/${student._id}`)}
            >
              {student.fullName} - {student.visaType} ({student.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentListPage;
