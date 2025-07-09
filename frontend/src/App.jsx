import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './routes/ProectedRoutes';

function App() {

  const { user } = useAuth();

  return (
    <Routes>
      <Route path ="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />    
    </Routes>
  )
}

export default App;
