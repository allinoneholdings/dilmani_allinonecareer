import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ApplyModal from '../components/ApplyModel';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch job details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error || "Job not found"}</p>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-4"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <button
          onClick={() => navigate("/jobs")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mb-6"
        >
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-blue-800">{job.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Job Details</h2>
              <p className="text-gray-600 mb-2">
                <strong>Type:</strong> {job.type}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Salary:</strong> ${job.salary.toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Posted by:</strong> {job.posted_by?.name || "Admin"}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>

          <button 
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
          >
            Apply Now
          </button>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default JobDetails;