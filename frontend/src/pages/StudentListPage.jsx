import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../services/axiosInstance";

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/api/students?filter=${filter}`);
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, [filter]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {filter?.toUpperCase()} Students
      </h2>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student._id} className="bg-white p-3 rounded shadow">
            {student.fullName} - {student.visaType} ({student.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentListPage;
