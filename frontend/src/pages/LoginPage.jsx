import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const handleLogin = async ({ username, password }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        // redirect or navigate to dashboard
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}
