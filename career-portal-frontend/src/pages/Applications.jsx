import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get('/api/applications')
      .then(res => setApplications(res.data.data.applications))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      {applications.length === 0 ? <p>No applications found.</p> :
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="border p-4 rounded shadow-md">
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Experience:</strong> {app.experience}</p>
              <p><strong>Skills:</strong> {app.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Applications;
