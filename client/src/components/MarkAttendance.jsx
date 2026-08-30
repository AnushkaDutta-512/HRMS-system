import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const MarkAttendance = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.role !== 'employee') {
    return (
      <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
        <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
        <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
        <p className="text-base text-gray-300">Only employees can mark daily attendance logs.</p>
      </div>
    );
  }

  const handleMark = async () => {
    setIsLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/attendance/mark`, {
        userId: user.id || user._id,
        name: user.name,
        email: user.email,
      });
      setMsg(res.data?.msg || 'Attendance marked successfully for today!');
      setIsSuccess(true);
    } catch (err) {
      console.error("Error marking attendance:", err.response?.data || err.message);
      setMsg(err.response?.data?.msg || 'Failed to mark attendance.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 px-4 relative z-10">
      <div className="glass-panel rounded-3xl p-10 shadow-2xl border border-dark-600/80 text-center bg-dark-900/85 backdrop-blur-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-600/20 text-purple-300 border border-purple-500/30 mb-6 shadow-inner">
          <span className="material-symbols-rounded text-5xl">fact_check</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-3 tracking-tight">Daily Check-In</h2>
        <p className="text-base text-gray-300 mb-8">Record your timestamped presence for today</p>

        <button
          onClick={handleMark}
          disabled={isLoading}
          className="w-full btn-primary py-4.5 text-lg font-bold flex items-center justify-center gap-3 shadow-2xl"
        >
          {isLoading ? (
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <span className="material-symbols-rounded text-3xl">fingerprint</span>
              Mark Today's Attendance
            </>
          )}
        </button>

        {msg && (
          <div className={`mt-8 p-4.5 rounded-2xl flex items-center justify-center gap-3 text-base font-semibold border ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span className="material-symbols-rounded text-2xl">
              {isSuccess ? 'check_circle' : 'error'}
            </span>
            <span>{msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
