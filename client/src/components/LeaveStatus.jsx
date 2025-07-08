import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveStatus = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [leaves, setLeaves] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'employee') {
      setMsg('❌ Access denied');
      return;
    }

    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:3036/api/leave/user/${user.id}`);
        setLeaves(res.data.leaves);
      } catch (err) {
        setMsg('❌ Error fetching leave data');
      }
    };

    fetchLeaves();
  }, [user]);

  if (msg) {
    return (
      <p className="text-red-600 text-center mt-10 text-lg font-semibold">
        {msg}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-[#002855] mb-6 text-center">
        My Leave History
      </h2>

      {leaves.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-xl bg-white">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-[#e7f1ff] text-[#023e7d] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">From</th>
                <th className="px-6 py-3 text-left">To</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="border-t hover:bg-blue-50 transition-all"
                >
                  <td className="px-6 py-4">
                    {new Date(leave.fromDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(leave.toDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'Rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center text-sm mt-6">
          No leave requests found.
        </p>
      )}
    </div>
  );
};

export default LeaveStatus;
