import React, { useState } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'employee') {
    return (
      <p className="text-center text-red-600 font-semibold mt-6 text-lg">
        ⛔ Only employees can mark attendance.
      </p>
    );
  }

  const handleMark = async () => {
    try {
      const res = await axios.post('http://localhost:3036/api/attendance/mark', {
        userId: user.id || user._id,
        name: user.name,
        email: user.email,
      });
      console.log("✅ Backend response:", res.data);
      setMsg('✅ Attendance marked for today!');
    } catch (err) {
      console.error("❌ Error marking attendance:", err.response?.data || err.message);
      setMsg('❌ ' + (err.response?.data?.msg || 'Something went wrong'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-6 py-10 bg-white rounded-3xl shadow-xl border border-[#cce0ff]">
      <h2 className="text-3xl font-bold text-center text-[#002855] mb-8">🕒 Mark Attendance</h2>

      <button
        onClick={handleMark}
        className="block w-full bg-[#0466c8] hover:bg-[#0353a4] text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200"
      >
        Mark Today
      </button>

      {msg && (
        <p
          className={`mt-6 text-center font-medium text-lg ${
            msg.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
};

export default MarkAttendance;
