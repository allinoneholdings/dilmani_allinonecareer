import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    role: 'admin' // default role
  });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await signup(form);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Full Name"
          className="border p-2 rounded"
          required
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
