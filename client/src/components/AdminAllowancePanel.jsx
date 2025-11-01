import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAllowancePanel = () => {
    const [requests, setRequests] = useState([]);
    const [remarksMap, setRemarksMap] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProofs, setSelectedProofs] = useState([]);
    const [error, setError] = useState(''); 
    const [message, setMessage] = useState(''); 

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchAllowanceRequests = async () => {
        setError('');
        setMessage(''); 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in as an admin.');
                return;
            }
            const res = await axios.get('https://hrms-system-9nvh.onrender.com/api/allowance/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to load allowance data:', err);
            setError(err.response?.data?.message || 'Failed to load allowance data.');
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAllowanceRequests();
        } else {
            setError('Access denied. Only administrators can view allowance requests.');
        }
    }, [user]); 

    if (!user || user.role !== 'admin') {
        return (
            <p className="text-red-600 text-center mt-6 text-lg">
                ⛔ Access denied. Only administrators can view this page.
            </p>
        );
    }

    const handleRemarkChange = (id, text) => {
        setRemarksMap((prev) => ({ ...prev, [id]: text }));
    };

    
    const handleAction = async (id, status) => {
        setError(''); // Clear previous errors
        setMessage(''); // Clear previous messages
        const remarks = remarksMap[id] || '';
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            const res = await axios.put(`https://hrms-system-9nvh.onrender.com/api/allowance/${id}`,
                { status, remarks },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || `Request ${status} successfully!`);
            
            fetchAllowanceRequests();
            setRemarksMap((prev) => ({ ...prev, [id]: '' })); 
        } catch (err) {
            console.error('Failed to update status:', err);
            setError(err.response?.data?.message || 'Failed to update status.');
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

            {message && <p className="text-green-600 mb-4 text-center font-medium">{message}</p>}
            {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

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
                                    
                                    {r.userId?.name}{' '}
                                    <span className="text-sm font-normal text-gray-500">({r.userId?.email})</span>
                                </p>
                                <p>
                                    Type: <span className="text-[#0353a4] font-medium">{r.type}</span>
                                </p>
                                <p>
                                    Amount: <span className="text-[#0466c8] font-medium">₹{r.amount}</span>
                                </p>
                                {r.reason && (
                                    <p>
                                        Reason: <span className="text-gray-700">{r.reason}</span>
                                    </p>
                                )}
                                {r.proofFiles && r.proofFiles.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedProofs(r.proofFiles);
                                            setModalOpen(true);
                                        }}
                                        className="text-blue-600 underline hover:text-blue-800 text-sm mt-2"
                                    >
                                        📎 View Uploaded Proof
                                    </button>
                                )}
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

            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative bg-white p-6 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Uploaded Proof</h2>

                        <div className="flex flex-col items-center space-y-4">
                            {selectedProofs.map((file, index) => {
                                const fileUrl = `http://localhost:3036/uploads/${file}`;
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

                                return (
                                    <div key={index} className="w-full text-center">
                                        {isImage ? (
                                            <img
                                                src={fileUrl}
                                                alt={`Proof ${index + 1}`}
                                                className="max-w-full max-h-[75vh] object-contain mx-auto rounded border shadow"
                                            />
                                        ) : (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                📄 Download File {index + 1}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAllowancePanel;