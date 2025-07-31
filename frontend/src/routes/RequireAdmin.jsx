import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequireAdmin;