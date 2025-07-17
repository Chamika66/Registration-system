import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you're storing the JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
