import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; 
import API_BASE_URL from '../apiConfig';

const ChangePassword = () => {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword === oldPassword) {
      return setError('New password must be different from your old password.');
    }

    if (newPassword !== confirmPassword) {
      return setError('New password and confirmation do not match.');
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        { oldPassword, currentPassword: oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data?.message || 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-2xl mx-auto relative z-10">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-DEFAULT/20 text-brand-light border border-brand-DEFAULT/30 mb-4 shadow-inner">
            <span className="material-symbols-rounded text-4xl">key</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2 tracking-tight">
            Security & Password
          </h1>
          <p className="text-base text-gray-300 font-sans">Update your account authentication credentials</p>
        </div>

        {message && (
          <div className="mb-6 p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-base font-semibold flex items-center gap-3">
            <span className="material-symbols-rounded text-2xl">check_circle</span>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-base font-semibold flex items-center gap-3">
            <span className="material-symbols-rounded text-2xl">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              Current Password <span className="text-brand-light">*</span>
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter current password"
              className="glass-input text-base bg-dark-800/90 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              New Password <span className="text-brand-light">*</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="glass-input text-base bg-dark-800/90 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              Confirm New Password <span className="text-brand-light">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
              className="glass-input text-base bg-dark-800/90 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            {isLoading ? (
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-rounded text-2xl">lock_reset</span>
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
