import { useState, useEffect } from "react";
import axios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions when typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`/api/students?search=${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSuggestions(res.data.students || []);
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Final search (optional if you want manual button-based search too)
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/students?search=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResults(res.data.students);
      setShowSuggestions(false);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Search by name, email, phone..."
        className="border border-gray-300 px-4 py-2 rounded w-full"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded shadow w-full max-h-48 overflow-y-auto">
          {suggestions.map((student) => (
            <li
              key={student._id}
              onClick={() => {
                setQuery(student.fullName);
                setShowSuggestions(false);
                setResults([student]); // show only selected student
                navigate(`/students/${student._id}`);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {student.fullName} - {student.visaType} ({student.status})
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSearch}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
