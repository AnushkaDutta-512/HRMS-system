import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyLeave = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [type, setType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');
  const [leaveDays, setLeaveDays] = useState(0);
  const [invalidDateRange, setInvalidDateRange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const MAX_LEAVE_DAYS = 15;
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today || end < today) {
        setInvalidDateRange(true);
        setMsg('❌ Cannot select past dates.');
        setLeaveDays(0);
      } else if (end < start) {
        setInvalidDateRange(true);
        setMsg('❌ "From" date cannot be after "To" date.');
        setLeaveDays(0);
      } else {
        const timeDiff = end - start;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        if (daysDiff > MAX_LEAVE_DAYS) {
          setInvalidDateRange(true);
          setMsg(`❌ You can apply for a maximum of ${MAX_LEAVE_DAYS} days.`);
        } else {
          setInvalidDateRange(false);
          setMsg('');
        }

        setLeaveDays(daysDiff);
      }
    } else {
      setLeaveDays(0);
      setInvalidDateRange(false);
      setMsg('');
    }
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    if (invalidDateRange || reason.trim() === '') return;

    try {
      setLoading(true);
      await axios.post('http://localhost:3036/api/leave/apply', {
        userId: user.id || user._id,
        name: user.name,
        email: user.email,
        type,
        fromDate,
        toDate,
        reason
      });

      setMsg('✅ Leave applied successfully!');
      setType('');
      setFromDate('');
      setToDate('');
      setReason('');
      setLeaveDays(0);
      setShowModal(false);
    } catch (err) {
      setMsg('❌ Failed to apply for leave.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-red-600 text-center mt-10 font-semibold">
        ⚠️ Please log in to apply for leave.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-3xl shadow-xl border border-[#cfe2ff]">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#002855]">📆 Apply for Leave</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!invalidDateRange && reason.trim() !== '') {
            setShowModal(true);
          }
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Leave Type:</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setMsg('');
            }}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0466c8] focus:border-[#0466c8]"
          >
            <option value="">-- Select --</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Earned">Earned Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setMsg('');
            }}
            required
            min={todayString}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0466c8] focus:border-[#0466c8]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setMsg('');
            }}
            required
            min={fromDate || todayString}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0466c8] focus:border-[#0466c8]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setMsg('');
            }}
            rows={3}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0466c8] focus:border-[#0466c8]"
          />
        </div>

        {leaveDays > 0 && !invalidDateRange && (
          <div className="mt-2 bg-blue-50 border border-blue-300 text-blue-800 px-4 py-2 rounded-md text-sm font-medium">
            Number of Leave Days: <span className="font-bold">{leaveDays}</span>
          </div>
        )}

        {msg && (
          <p className={`mt-2 font-medium text-sm ${msg.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={invalidDateRange || loading}
          className={`w-full py-2 px-4 rounded-md font-semibold transition duration-200 
            ${invalidDateRange || loading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-[#0466c8] hover:bg-[#023e7d] text-white'}`}
        >
          {loading ? 'Applying...' : 'Apply Leave'}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md border border-blue-100">
            <h3 className="text-xl font-semibold mb-4 text-[#002855]">Confirm Leave Application</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to apply for <strong>{leaveDays}</strong> day(s) of <strong>{type}</strong> leave
              from <strong>{fromDate}</strong> to <strong>{toDate}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#0466c8] text-white rounded hover:bg-[#023e7d] font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyLeave;
