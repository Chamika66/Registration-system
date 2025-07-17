import LoginPage from './pages/LoginPage'
import Dashboard from './pages/DashboardPage'
import { useAuth } from './context/AuthContext'
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoute';
import AddStudentForm from './pages/AddStudentForm';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';


function App() {

  const { user } = useAuth();

  return (
    <Routes>
      <Route path ="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />   
      <Route path="/add-student" element={<ProtectedRoute><AddStudentForm /></ProtectedRoute>} />
      <Route path="/students" element={<StudentListPage/>}/>
      <Route path="/students/:id" element={<StudentDetailPage/>} />      
    </Routes>
  )
}

export default App;
