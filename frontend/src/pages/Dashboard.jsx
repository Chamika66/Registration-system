import { useAuth } from "../context/AuthContext";
//import DashboardPage from "../components/DashboardPage";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className ="p-8">
            <h1 className= " text-2xl font-bold"> Welcome, {user?.username || "Admin"}</h1>
            <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={logout}
            >
                Logout
            </button>
            
        </div>
    );
};

export default Dashboard;