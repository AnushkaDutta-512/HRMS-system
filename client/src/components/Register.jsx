/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [msg, setMsg] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [salary, setSalary] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3036/api/auth/register', {
        name,
        email,
        password,
        role,
        dateOfJoining,
        salary
      });

      setMsg('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">📝 Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Joining</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin/HR</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Register
          </button>
        </form>

        {msg && (
          <p className={`mt-4 text-center text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
*/