import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceRecords = () => {
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const res = await axios.get('https://hrms-system-9nvh.onrender.com/api/attendance/all');
        setRecords(res.data.records);
      } catch (err) {
        setMsg('❌ Failed to load attendance records.');
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center text-red-600 mt-12 font-semibold text-lg">
        ⛔ Access Restricted: HR/Admins Only
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-extrabold text-center text-[#002855] mb-6">
        📊 Employee Attendance Records
      </h2>

      {msg && <p className="text-red-500 font-medium text-center">{msg}</p>}

      {records.length === 0 ? (
        <p className="text-gray-600 text-center mt-8">No attendance data available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-100">
          <table className="min-w-full text-sm text-left bg-white rounded-xl">
            <thead className="bg-[#e0efff] text-[#001845] text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6"> Date</th>
                <th className="py-4 px-6"> Name</th>
                <th className="py-4 px-6"> Email</th>
                <th className="py-4 px-6"> Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {records.map((r, idx) => (
                <tr key={r._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`}>
                  <td className="py-3 px-6">{r.date}</td>
                  <td className="py-3 px-6">{r.name}</td>
                  <td className="py-3 px-6">{r.email}</td>
                  <td className={`py-3 px-6 font-bold ${r.status === 'Present' ? 'text-green-600' : 'text-red-500'}`}>
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
