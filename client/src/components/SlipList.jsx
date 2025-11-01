import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlipList = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const fetchSlips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const userId = user?.id || user?._id;
      const res = await axios.get(`http://localhost:3036/api/salary/slips/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlips(res.data);
    } catch (err) {
      console.error('Error fetching slips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlips(); }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 to-white min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">My Salary Slips</h2>

      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : slips.length === 0 ? (
        <p className="text-gray-700">No salary slips available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="w-full text-left table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">Month</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((slip) => (
                <tr key={slip._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-4 font-medium">{slip.month}</td>
                  <td className="p-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      onClick={() => setSelectedSlip(slip)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedSlip(null)}
            >
              ✖
            </button>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Salary Slip - {selectedSlip.month}
            </h3>

            {selectedSlip?.details?.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-blue-100 text-blue-800">
                  <tr>
                    <th className="p-3">Component</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSlip.details.map((d, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{d.component}</td>
                      <td className="p-3">{d.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-700">No salary details available for this month.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlipList;
