import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAllowancePanel = () => {
  const [requests, setRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:3036/api/allowance/all')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Failed to load allowance data', err));
  }, []);

  const handleRemarkChange = (id, text) => {
    setRemarksMap((prev) => ({ ...prev, [id]: text }));
  };

  const handleAction = async (id, status) => {
    const remarks = remarksMap[id] || '';
    try {
      await axios.put(`http://localhost:3036/api/allowance/${id}`, { status, remarks });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status, remarks } : r))
      );
      setRemarksMap((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#002855]">Allowance Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No allowance requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-[#023e7d]/20 rounded-2xl shadow hover:shadow-lg transition duration-300 p-6"
            >
              <div className="mb-3 space-y-1">
                <p className="text-lg font-semibold text-[#001845]">
                  {r.userId.name}{' '}
                  <span className="text-sm font-normal text-gray-500">({r.userId.email})</span>
                </p>
                <p>Type: <span className="text-[#0353a4] font-medium">{r.type}</span></p>
                <p>Amount: <span className="text-[#0466c8] font-medium">₹{r.amount}</span></p>
                {r.reason && <p>Reason: <span className="text-gray-700">{r.reason}</span></p>}
                <p>
                  Status:
                  <span
                    className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </p>
              </div>

              {r.status === 'pending' && (
                <div className="mt-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#0466c8]"
                    rows={2}
                    placeholder="Enter remarks (optional)"
                    value={remarksMap[r._id] || ''}
                    onChange={(e) => handleRemarkChange(r._id, e.target.value)}
                  />
                  <div className="flex gap-4 mt-3">
                    <button
                      className="bg-[#0466c8] hover:bg-[#0353a4] text-white px-4 py-2 rounded-md font-medium shadow-sm transition"
                      onClick={() => handleAction(r._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition"
                      onClick={() => handleAction(r._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {r.remarks && r.status !== 'pending' && (
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Admin Remarks:</strong> {r.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllowancePanel;
