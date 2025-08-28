import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    // Navigate to the Jobs page
    navigate("/jobs");
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Career Portal of All in One Holdings
      </h1>
      <p className="text-gray-700 mb-6">
        Apply for jobs and reach your dream career!
      </p>
      <button
        onClick={handleApplyNow}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300"
      >
        APPLY NOW
      </button>
    </div>
  );
};

export default Home;
