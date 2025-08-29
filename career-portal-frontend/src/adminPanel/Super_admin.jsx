import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin Panel</h1>
    <nav className="mb-4">User management</nav>
    <nav className="mb-4">Rejected applications</nav>
    <nav className="mb-4">Accepted applications</nav>
    <nav className="mb-4">All applications </nav>
    
    </div>
  );
};

export default AdminPanel;
