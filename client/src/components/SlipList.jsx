import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlipList = () => {
  const [slips, setSlips] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSlips = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;

      if (!user || !userId) {
        setMsg('⚠️ User not logged in.');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3036/api/salary/user/${userId}`);
        setSlips(res.data.slips);
      } catch (err) {
        setMsg('❌ Error fetching slips');
      }
    };

    fetchSlips();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
        Your Salary Slips
      </h2>

      {msg && <p className="text-red-600 font-semibold text-center mb-4">{msg}</p>}

      {slips.length > 0 ? (
        <ul className="space-y-3">
          {slips.map((slip) => (
            <li
              key={slip._id}
              className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-300 hover:shadow-md transition"
            >
              <span className="font-medium text-gray-800">{slip.month}</span>
              <a
                href={`http://localhost:3036/uploads/${slip.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                View Slip
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center italic">No salary slips available.</p>
      )}
    </div>
  );
};

export default SlipList;
