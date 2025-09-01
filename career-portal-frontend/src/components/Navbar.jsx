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
      <div className="container flex justify-between items-center">
        {/* Hide Career Portal link for admin/superadmin users */}
        {!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') ? (
          <Link to="/" className="text-xl font-bold">Career Portal</Link>
        ) : (
          <div className="text-xl font-bold">Admin Panel</div>
        )}
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && (
                <Link to="/admin" className="hover:underline">Admin</Link>
              )}
              {currentUser.role === 'superadmin' && (
                <>
                  <Link to="/superadmin" className="hover:underline">Super Admin</Link>
                  <Link to="/post-job" className="hover:underline">Post Job</Link>
                </>
              )}
              <span>Hello, {currentUser.username}</span>
              <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;