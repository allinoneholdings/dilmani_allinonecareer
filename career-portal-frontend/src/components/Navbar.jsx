import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Career Portal</Link>
        <div className="flex items-center space-x-4">
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              {currentUser.role === 'superadmin' && (
                <Link to="/post-job" className="hover:underline">Post Job</Link>
              )}
              <span>Hello, {currentUser.username}</span>
              <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
