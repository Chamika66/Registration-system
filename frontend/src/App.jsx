import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddStudentForm from './pages/AddStudentForm';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import EditStudentForm from './pages/EditStudentForm';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
//import RequireAdmin from "./routes/RequireAdmin";
import AddCoadminPage from "./pages/AddCoadminPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes inside AdminLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="add-student" element={<AddStudentForm />} />
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="edit-student/:id" element={<EditStudentForm />} />
        <Route path="add-coadmin" element={<AddCoadminPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;
