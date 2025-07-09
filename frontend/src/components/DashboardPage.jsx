import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className ="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {user?.username || "Admin"}</h1>

                <div className= "mb-6">
                    <p><strong>Name :</strong> {user?.name}</p>
                    <p><strong>Email :</strong> {user?.email}</p>
                    <p><strong>Username :</strong> {user?.username}</p>
                    <p><strong>Role :</strong> {user?.role}</p>
                </div>

                <div className="Flex gap-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={logout}
                    >
                        Logout
                    </button>

                    <button 
                        onClick ={()=> alert("Gotostudent list page")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Student List
                    </button>
                </div>
                </div>
        </div>

    );
};

export default DashboardPage;