import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      const res = await login(username, password);
      
      // Check if res exists and has the expected structure
      if (res && res.success && res.user) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'superadmin') {
          navigate('/superadmin');
        } else {
          // Default redirect for other roles or no role
          navigate('/dashboard');
        }
      } else {
        // Handle cases where res is undefined or doesn't have expected structure
        setError(res?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="Username" 
          className="border p-2 rounded" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="border p-2 rounded" 
          required 
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;