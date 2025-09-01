import React, { useEffect, useState } from "react";
import axios from "axios";

const SuperAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "admin"
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchJobs();
  }, [token]);

  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      setFilteredApplications([]);
      return;
    }
    fetchApplications();
  }, [selectedJobId, token]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    }
  }, [applications, statusFilter]);

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

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job._id !== jobId));
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
      }
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", 
        userForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowUserModal(false);
      setUserForm({ 
        name: "", 
        username: "", 
        email: "", 
        password: "", 
        role: "admin" 
      });
      alert("User created successfully");
    } catch (err) {
      setError("Failed to create user: " + (err.response?.data?.message || err.message));
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      const res = await axios.patch(
        `/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">SuperAdmin Dashboard</h1>
        <button
          onClick={() => setShowUserModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-800 font-bold">×</button>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
          <h3 className="text-gray-600 font-semibold">Total</h3>
          <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
          <h3 className="text-yellow-700 font-semibold">Pending</h3>
          <p className="text-2xl font-bold text-yellow-700">{getStatusCount('pending')}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <h3 className="text-green-700 font-semibold">Accepted</h3>
          <p className="text-2xl font-bold text-green-700">{getStatusCount('accepted')}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
          <h3 className="text-red-700 font-semibold">Rejected</h3>
          <p className="text-2xl font-bold text-red-700">{getStatusCount('rejected')}</p>
        </div>
      </div>

      {/* Jobs Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Jobs</h2>
        {loadingJobs ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedJobId === job._id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJob(job._id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm bg-white rounded-full p-1"
                  >
                    🗑️
                  </button>
                </div>
                <div className="text-sm mb-2">
                  {job.type} - ${job.salary}
                </div>
                <div className="text-xs opacity-75">
                  Posted by: {job.posted_by?.name || "Unknown"}
                </div>
                <button
                  onClick={() => setSelectedJobId(job._id)}
                  className={`mt-3 px-3 py-1 text-sm rounded ${
                    selectedJobId === job._id
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  View Applications
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedJobId && (
        <section className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Applications for Selected Job</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loadingApplications ? (
            <p className="text-gray-600">Loading applications...</p>
          ) : filteredApplications.length === 0 ? (
            <p className="text-gray-600">
              No applications found {statusFilter !== "all" ? `with status "${statusFilter}"` : ""} for this job.
            </p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => {
                    const isUpdating = updatingStatus[app._id];
                    const resumeUrl = getResumeUrl(app.resume);
                    
                    return (
                      <tr key={app._id} className={isUpdating ? "bg-gray-50" : "hover:bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.name || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.email || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.experience ? `${app.experience.years}y ${app.experience.months}m` : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {Array.isArray(app.skills) ? app.skills.join(", ") : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {Array.isArray(app.education) 
                            ? app.education.map(edu => `${edu.degree} at ${edu.institution}`).join(", ") 
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status || 'pending')}`}>
                            {app.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {resumeUrl ? (
                         <a href={`http://localhost:5000/uploads/${app.resume.path}`} target="_blank" rel="noreferrer">View Resume</a>

                          ) : "No Resume"}
                        </td>
                        <td classsName="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateApplicationStatus(app._id, 'accepted')}
                              disabled={isUpdating || app.status === 'accepted'}
                              className={`px-3 py-1 rounded text-white ${
                                app.status === 'accepted' 
                                  ? 'bg-green-600 cursor-not-allowed' 
                                  : 'bg-gray-600 hover:bg-green-600'
                              } disabled:opacity-50`}
                            >
                              {app.status === 'accepted' ? '✓ Accepted' : 'Accept'}
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app._id, 'rejected')}
                              disabled={isUpdating || app.status === 'rejected'}
                              className={`px-3 py-1 rounded text-white ${
                                app.status === 'rejected' 
                                  ? 'bg-red-600 cursor-not-allowed' 
                                  : 'bg-gray-600 hover:bg-red-600'
                              } disabled:opacity-50`}
                            >
                              {app.status === 'rejected' ? '✗ Rejected' : 'Reject'}
                            </button>
                          </div>
                          {isUpdating && <div className="text-xs text-gray-500 mt-1">Updating...</div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  value={userForm.username}
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;