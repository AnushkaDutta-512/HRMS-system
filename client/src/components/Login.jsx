import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://hrms-system-9nvh.onrender.com/api/auth/login', {

        email,
        password,
      });
      const { token, user } = res.data;
      if (token && user) {
        login(user, token);
        navigate('/welcome');
      } else {
        setMsg('❌ Login failed: Invalid response');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-white">
      <div className="w-full max-w-sm p-8 bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </button>
          {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}
        </form>
        <p className="text-sm text-center mt-6 text-gray-700">
           <span className="text-blue-600 font-medium cursor-pointer"></span>
        </p>
      </div>
    </div>
  );
};

export default Login;
