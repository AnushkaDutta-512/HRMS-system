import React, { useState } from 'react';
import axios from 'axios';

const UploadSlip = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [userId, setUserId] = useState('');
  const [month, setMonth] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <p className="text-red-600 font-semibold text-center mt-10">
        ⛔ Access denied. Only HR/Admin can upload slips.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !month || !file) {
      setMsg('❌ Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('month', month);
    formData.append('slip', file);

    try {
      const res = await axios.post('http://localhost:3036/api/salary/upload', formData);
      setMsg('✅ Salary slip uploaded!');
      console.log(res.data);
    } catch (err) {
      setMsg('❌ Upload failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        📤 Upload Salary Slip
      </h2>

      {msg && (
        <p
          className={`mb-4 text-sm font-medium text-center ${
            msg.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {msg}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Employee User ID:
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select User ID --</option>
            {/* TODO: Populate options from backend */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Month:
          </label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="e.g. June 2025"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Slip (PDF/JPG/PNG):
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadSlip;
