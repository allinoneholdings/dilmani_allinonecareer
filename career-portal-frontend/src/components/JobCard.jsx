import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
  <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
    <p className="text-gray-600 mb-2">Type: {job.type}</p>
    <p className="text-gray-600 mb-2">Salary: RS.{job.salary}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {job.skills.map((skill, i) => (
        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{skill}</span>
      ))}
    </div>
    <Link to={`/jobs/${job._id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">View Details</Link>
  </div>
);

export default JobCard;
