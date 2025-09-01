import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';

import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import PostJob from './pages/PostJob.jsx';


import Upload from './pages/upload.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Admin from './adminPanel/Admin.jsx'; // This imports as Admin
import SuperAdmin from './adminPanel/Super_admin.jsx'; // This imports as SuperAdmin

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/home" element={<Home />} />
           
            
            {/* FIXED: Changed <admin /> to <Admin /> */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* FIXED: Changed <superadmin /> to <SuperAdmin /> */}
            <Route path="/superadmin" element={
              <ProtectedRoute>
                <SuperAdmin />
              </ProtectedRoute>
            } />
            
          
            
            <Route path="/post-job" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <PostJob />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;