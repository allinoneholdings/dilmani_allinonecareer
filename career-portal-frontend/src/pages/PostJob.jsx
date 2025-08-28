import React, { useState } from 'react';
import SkillsInput from '../components/SkillsInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext hook

const PostJob = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get current logged-in user
  const [job, setJob] = useState({ title:'', type:'', salary:'', description:'', requirements:'', skills:[] });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be logged in to post a job');
      return;
    }

    try {
      // Axios will automatically include Authorization header from AuthContext
      await axios.post('/api/jobs', job);
      alert('Job posted successfully!');
      navigate('/jobs');
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Post Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input 
          value={job.title} 
          onChange={e => setJob({...job, title:e.target.value})} 
          placeholder="Title" 
          className="border p-2 rounded" 
          required 
        />
        <input 
          value={job.type} 
          onChange={e => setJob({...job, type:e.target.value})} 
          placeholder="Type" 
          className="border p-2 rounded" 
          required 
        />
        <input 
          type="number" 
          value={job.salary} 
          onChange={e => setJob({...job, salary:e.target.value})} 
          placeholder="Salary" 
          className="border p-2 rounded" 
          required 
        />
        <textarea 
          value={job.description} 
          onChange={e => setJob({...job, description:e.target.value})} 
          placeholder="Description" 
          className="border p-2 rounded" 
          required 
        />
        <textarea 
          value={job.requirements} 
          onChange={e => setJob({...job, requirements:e.target.value})} 
          placeholder="Requirements" 
          className="border p-2 rounded" 
          required 
        />
        <SkillsInput 
          skills={job.skills} 
          setSkills={skills => setJob({...job, skills})} 
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
