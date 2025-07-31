import { useState } from "react";
import axios from "../services/axiosInstance";
import { Eye, EyeOff } from "lucide-react"; // You can install lucide-react or replace with emoji/icons

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{10,}$/;
    const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strong.test(password)) return "strong";
    if (medium.test(password)) return "medium";
    return "weak";
  };

  const strength = getPasswordStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match.");
    }

    if (strength === "weak") {
      return setError("Password is too weak. Use uppercase, lowercase, numbers.");
    }

    try {
      await axios.put(
        "/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err?.response?.data || err.message);
      setError("Failed to change password.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {error && <p className="text-red-600">{error}</p>}

        {/* Current Password */}
        <div className="relative">
          <label className="block font-medium">Current Password</label>
          <input
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <span
            onClick={() => toggleVisibility("current")}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block font-medium">New Password</label>
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <span
            onClick={() => toggleVisibility("new")}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>

          {/* Password Strength Meter */}
          <div className="mt-1">
            <div
              className={`h-2 rounded transition-all ${
                strength === "strong"
                  ? "bg-green-500 w-full"
                  : strength === "medium"
                  ? "bg-yellow-400 w-2/3"
                  : "bg-red-500 w-1/3"
              }`}
            ></div>
            <p className="text-sm mt-1 text-gray-600 capitalize">{strength && `Strength: ${strength}`}</p>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block font-medium">Confirm New Password</label>
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <span
            onClick={() => toggleVisibility("confirm")}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
