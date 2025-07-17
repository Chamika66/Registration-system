const StatCard = ({ label, value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow-md rounded-lg p-4 text-left hover:shadow-xl transition duration-200 w-full"
    >
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );
};

export default StatCard;
