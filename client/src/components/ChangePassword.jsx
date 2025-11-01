import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; 

const ChangePassword = () => {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword === oldPassword) {
      return setError('❌ New password must be different from old password.');
    }

    if (newPassword !== confirmPassword) {
      return setError('❌ Confirm password does not match.');
    }

    try {
      const res = await axios.put(
        'http://localhost:3036/api/auth/change-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.msg || '❌ Failed to change password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7f1ff] to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#cfe2ff]">
        <h1 className="text-2xl font-extrabold text-center mb-6 text-[#002855]">
          Change Your Password
        </h1>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter your old password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#023e7d] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#023e7d] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#023e7d] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0466c8] text-white font-bold rounded-xl shadow hover:bg-[#0353a4] transition duration-200"
          >
            Update Password
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center font-medium">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-sm text-green-600 text-center font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
