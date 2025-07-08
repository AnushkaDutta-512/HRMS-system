import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust path if needed

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3036/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);

      const userData = {
        id: res.data.user._id || res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      };

      const res2 = await axios.get(`http://localhost:3036/api/auth/employee/${userData.id}`);
      userData.profilePic = res2.data.profilePic;

      login(userData);
      setMsg('✅ Login successful');
      navigate('/welcome');
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7f1ff] to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#cfe2ff]">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-[#002855]"> Sign In to HRMS</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. abc@example.com"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#023e7d] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#023e7d] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0466c8] text-white font-bold rounded-xl shadow hover:bg-[#0353a4] transition duration-200"
          >
            Login
          </button>
        </form>

        {msg && (
          <p className={`mt-4 text-center text-sm font-medium ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
