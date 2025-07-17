import { useState } from "react";
import axios from "../services/axiosInstance";

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/students?search=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResults(res.data.students);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder="Search by name, email, phone..."
        className="border border-gray-300 px-4 py-2 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
