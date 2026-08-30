import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AttendanceRecords = () => {
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/attendance/all`);
        setRecords(res.data.records || []);
      } catch (err) {
        setMsg('Failed to load attendance records.');
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
        <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
        <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
        <p className="text-base text-gray-300">Only HR Administrators can view attendance logs.</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Standard Uniform Module Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="material-symbols-rounded text-brand-light text-4xl">calendar_month</span>
          Attendance Records
        </h2>
        <p className="text-base text-gray-300 mt-2 font-sans">Audit log of daily check-ins across workforce</p>
      </div>

      {msg && (
        <div className="mb-6 p-4.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-base font-semibold flex items-center gap-3">
          <span className="material-symbols-rounded text-2xl">error</span>
          <span>{msg}</span>
        </div>
      )}

      {records.length === 0 ? (
        <div className="glass-panel p-10 text-center rounded-3xl">
          <p className="text-gray-300 text-lg">No attendance data currently logged.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
          <div className="overflow-x-auto">
            <table className="min-w-full text-base text-left border-collapse">
              <thead>
                <tr className="bg-dark-800/95 text-gray-200 text-sm font-bold uppercase tracking-wider border-b border-dark-600/80">
                  <th className="py-5 px-6 font-bold">Date</th>
                  <th className="py-5 px-6 font-bold">Employee Name</th>
                  <th className="py-5 px-6 font-bold">Email Address</th>
                  <th className="py-5 px-6 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="py-5 px-6 font-mono text-gray-200 text-sm font-bold">{r.date}</td>
                    <td className="py-5 px-6 font-bold text-white text-base">{r.name}</td>
                    <td className="py-5 px-6 text-gray-200 font-mono text-sm">{r.email}</td>
                    <td className="py-5 px-6">
                      <span className={r.status === 'Present' ? 'badge-green' : 'badge-red'}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
