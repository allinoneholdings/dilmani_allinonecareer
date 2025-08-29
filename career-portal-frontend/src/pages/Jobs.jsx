import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch jobs");
        setLoading(false);
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">All Job Opportunities</h1>
        <p className="text-gray-700 mb-6">
          Browse through all available positions at All in One Holdings
        </p>
      </div>

      <div>
        {jobs.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-xl mb-4">No jobs available at the moment.</p>
            <p>Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleJobClick(job._id)}
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>Type:</strong> {job.type}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Salary:</strong> ${job.salary.toLocaleString()}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {job.description}
                </p>
                <div className="mb-4">
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;