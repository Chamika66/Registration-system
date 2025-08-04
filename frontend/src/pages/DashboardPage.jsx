import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import DashboardChart from "../components/DashboardChart";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import VisaStatusChart from "../components/VisaStatusChart";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/students/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Dashboard Stats Response:", res.data);
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.username || "Admin"}
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Add Student Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/add-student")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Student
        </button>
      </div>

      {/* Search Students */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Students</h2>
        <SearchBar setResults={setSearchResults} />
        {searchResults.length > 0 && (
          <ul className="mt-4 space-y-2">
            {searchResults.map((student) => (
              <li
                key={student._id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/students/${student._id}`)}
              >
                {student.fullName} - {student.visaType} ({student.status})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents || 0}
          onClick={() => navigate("/students?filter=all")}
        />
        <StatCard
          label="Approved visa"
          value={stats?.status?.approved || 0}
          onClick={() => navigate("/students?filter=approved")}
        />
        <StatCard
          label="Pending visa"
          value={stats?.status?.pending || 0}
          onClick={() => navigate("/students?filter=pending")}
        />
        <StatCard
          label="Rejected visa"
          value={stats?.status?.rejected || 0}
          onClick={() => navigate("/students?filter=rejected")}
        />
      </div>

      {/* All Charts in One Horizontal Line */}
<div className="flex flex-col md:flex-row gap-4">
  {/* Visa Type Chart */}
  <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
    <h2 className="text-lg font-semibold mb-4">Visa Type Chart</h2>
    {stats?.visaType ? (
      <DashboardChart visaType={stats.visaType} />
    ) : (
      <p>No visa data available.</p>
    )}
  </div>

  {/* Student Visa Status */}
  <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
    <h2 className="text-lg font-semibold mb-4">Student Visa Status</h2>
    <VisaStatusChart
      title=""
      approved={stats?.visaStatusBreakdown?.student?.approved || 0}
      pending={stats?.visaStatusBreakdown?.student?.pending || 0}
    />
  </div>

  {/* SSW Visa Status */}
  <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
    <h2 className="text-lg font-semibold mb-4">SSW Visa Status</h2>
    <VisaStatusChart
      title=""
      approved={stats?.visaStatusBreakdown?.ssw?.approved || 0}
      pending={stats?.visaStatusBreakdown?.ssw?.pending || 0}
    />
  </div>
</div>


      
    </div>
  );
};

export default DashboardPage;
