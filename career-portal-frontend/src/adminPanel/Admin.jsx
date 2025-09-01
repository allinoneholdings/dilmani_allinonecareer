import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setError(null);
      try {
        const res = await axios.get("/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [token]);

  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      return;
    }

    const fetchApplications = async () => {
      setLoadingApplications(true);
      setError(null);
      try {
        const res = await axios.get(`/api/applications/job/${selectedJobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        setError("Failed to load applications");
      } finally {
        setLoadingApplications(false);
      }
    };
    fetchApplications();
  }, [selectedJobId, token]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      await axios.patch(
        `/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));

    } catch (err) {
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

   const getResumeUrl = (resumeData) => {
  if (!resumeData || !resumeData.path) return null;
  return `http://localhost:5000/${resumeData.path}`;
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && <div className="text-red-500 p-2 mb-4 bg-red-100 rounded">{error}</div>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Jobs</h2>
        {loadingJobs ? <p className="text-gray-600">Loading jobs...</p> : (
          <ul className="list-none p-0">
            {jobs.map((job) => (
              <li 
                key={job._id} 
                onClick={() => setSelectedJobId(job._id)} 
                className={`cursor-pointer p-2 mb-1 rounded ${selectedJobId === job._id ? 'bg-gray-300' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}
              >
                <strong>{job.title}</strong> - {job.type} - ${job.salary}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">
          Applications {selectedJobId && `(Job ID: ${selectedJobId})`}
        </h2>
        {loadingApplications ? <p className="text-gray-600">Loading applications...</p> : applications.length === 0 ? (
          <p className="text-gray-600">No applications found for this job.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Applicant Name</th>
                  <th className="border border-gray-300 p-2 text-left">Email</th>
                  <th className="border border-gray-300 p-2 text-left">Experience</th>
                  <th className="border border-gray-300 p-2 text-left">Skills</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                  <th className="border border-gray-300 p-2 text-left">Resume</th>
                  <th className="border border-gray-300 p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const isUpdating = updatingStatus[app._id];
                      const resumeUrl = getResumeUrl(app.resume)
                  
                  return (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{app.name || "N/A"}</td>
                      <td className="border border-gray-300 p-2">{app.email || "N/A"}</td>
                      <td className="border border-gray-300 p-2">{app.experience ? `${app.experience.years}y ${app.experience.months}m` : "N/A"}</td>
                      <td className="border border-gray-300 p-2">{Array.isArray(app.skills) ? app.skills.join(", ") : "N/A"}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-white ${getStatusColor(app.status)}`}>
                          {app.status || "pending"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">
                        {resumeUrl ? (
                         <a href={`http://localhost:5000/uploads/${app.resume.path}`} target="_blank" rel="noreferrer">View Resume</a>

                          ) : "No Resume"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app._id, 'accepted')}
                            disabled={isUpdating || app.status === 'accepted'}
                            className={`px-3 py-1 rounded text-white ${app.status === 'accepted' ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-50`}
                          >
                            {app.status === 'accepted' ? 'Accepted' : 'Accept'}
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                            disabled={isUpdating || app.status === 'rejected'}
                            className={`px-3 py-1 rounded text-white ${app.status === 'rejected' ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'} disabled:opacity-50`}
                          >
                            {app.status === 'rejected' ? 'Rejected' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;