import React, { useState, useEffect } from 'react';
import { FaDownload, FaCheck, FaTimes, FaEye, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, logout } = useAuth(); // Fixed: use the hook directly

  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (!currentUser) {
      setError('Authentication required. Please log in.');
      setIsLoading(false);
      return;
    }
    
    if (currentUser.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setIsLoading(false);
      return;
    }
    
    // If user is authenticated admin, fetch applications
    fetchApplications();
  }, [currentUser]);

  // Rest of your component remains the same...
  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error('Server returned HTML instead of JSON. Check your API endpoint.');
        }
        throw new Error(`Invalid response format: ${contentType}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = async (application) => {
    try {
      const token = localStorage.getItem('token');
      
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = `/api/applications/${application._id}/resume?token=${token}`;
      link.setAttribute('download', application.resume?.originalName || 'resume.pdf');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again.');
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      const updatedApplication = await response.json();
      
      // Update locally
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({...selectedApplication, status: newStatus});
      }
      
      alert(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const retryFetch = () => {
    fetchApplications();
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
          <div className="text-xl">Loading applications...</div>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated or not admin
  if (error && (!currentUser || currentUser.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for other errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Applications</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={retryFetch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Applications Dashboard</h1>
            <p className="text-gray-600">Welcome, {currentUser?.name || currentUser?.username}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchApplications}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <FaSpinner className="mr-2" /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No applications found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <FaUser />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.applicantId?.name || application.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">ID: {application._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaEnvelope className="mr-1 text-gray-400" /> 
                          {application.applicantId?.email || application.email || 'N/A'}
                        </div>
                        {application.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-1 text-gray-400" /> {application.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.jobId?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.experience?.years || 0} yrs {application.experience?.months || 0} mos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${application.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewApplicationDetails(application)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {application.resume && (
                            <button
                              onClick={() => handleDownloadCV(application)}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                              title="Download CV"
                            >
                              <FaDownload />
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(application._id, 'accepted')}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                            title="Accept Application"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleStatusChange(application._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                            title="Reject Application"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="my-4">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                    <FaUser />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">
                      {selectedApplication.applicantId?.name || selectedApplication.name || 'N/A'}
                    </h4>
                    <p className="text-gray-500">ID: {selectedApplication._id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-semibold flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" /> Email
                    </h5>
                    <p>{selectedApplication.applicantId?.email || selectedApplication.email || 'N/A'}</p>
                  </div>
                  {selectedApplication.phone && (
                    <div>
                      <h5 className="font-semibold flex items-center">
                        <FaPhone className="mr-2 text-gray-400" /> Phone
                      </h5>
                      <p>{selectedApplication.phone}</p>
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold">Job Title</h5>
                    <p>{selectedApplication.jobId?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold flex items-center">
                      <FaBriefcase className="mr-2 text-gray-400" /> Experience
                    </h5>
                    <p>{selectedApplication.experience?.years || 0} years {selectedApplication.experience?.months || 0} months</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-semibold">Skills</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedApplication.skills && selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedApplication.education && selectedApplication.education.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold">Education</h5>
                    {selectedApplication.education.map((edu, index) => (
                      <div key={index} className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{edu.degree} in {edu.field}</p>
                        <p className="text-gray-600">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                        {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedApplication.notes && (
                  <div className="mb-4">
                    <h5 className="font-semibold">Notes</h5>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedApplication.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  {selectedApplication.resume && (
                    <button
                      onClick={() => handleDownloadCV(selectedApplication)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <FaDownload className="mr-2" /> Download CV
                    </button>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(selectedApplication._id, 'rejected')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaTimes className="mr-2" /> Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApplication._id, 'accepted')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaCheck className="mr-2" /> Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;