import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Add Student", path: "/add-student" },
    { label: "All Students", path: "/students?filter=all" },
    { label: "Approved Students", path: "/students?filter=approved" },
    { label: "Pending Students", path: "/students?filter=pending" },
    { label: "Rejected Students", path: "/students?filter=rejected" },
    { label: "Change Password", path: "/change-password" },
  ];

  // Only admins can see this
  if (user?.role === "admin") {
    links.push({ label: "Add Co-Admin", path: "/add-coadmin" });
  }

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-6">Side Panel</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                location.pathname.includes(link.path) ? "bg-gray-700" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
