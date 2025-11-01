
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');     
    const user = JSON.parse(localStorage.getItem('user'));

   const displayTypeMap = {
        sickLeave: 'Sick Leave',
        casualLeave: 'Casual Leave',
        earnedLeave: 'Earned Leave'
    };

    const fetchLeaves = async () => {
        setMessage(''); 
        setError('');  
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in as an admin.');
                return;
            }
            const res = await axios.get('https://hrms-system-9nvh.onrender.com/api/leave/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data);
        } catch (err) {
            console.error('Error fetching leave requests:', err);
            setError(err.response?.data?.message || '❌ Failed to fetch leave requests.');
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchLeaves();
        } else {
            setError('Access denied. You must be an admin to view leave requests.');
        }
    }, [user]); 
    if (!user || user.role !== 'admin') {
        return (
            <p className="text-red-600 text-center mt-6 text-lg">
                ⛔ Access denied. Only administrators can view this page.
            </p>
        );
    }

    
    const updateStatus = async (id, status) => {
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            const res = await axios.put(`https://hrms-system-9nvh.onrender.com/api/leave/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message); 
            fetchLeaves();
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || 'Failed to update status.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-[#002855] mb-6 text-center">
                All Leave Requests
            </h2>

            {message && (
                <p className="text-green-600 mb-4 text-center font-medium">{message}</p>
            )}
            {error && (
                <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
            )}

            {leaves.length === 0 ? (
                <p className="text-gray-600 text-center">No leave requests yet.</p>
            ) : (
                <div className="overflow-x-auto bg-white border border-blue-100 rounded-2xl shadow-xl">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-[#e7f1ff] text-[#023e7d] uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Employee ID</th> 
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">From</th>
                                <th className="px-6 py-3 text-left">To</th>
                                <th className="px-6 py-3 text-left">Reason</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr
                                    key={leave._id}
                                    className="border-t hover:bg-blue-50 transition-all"
                                >
                                    <td className="px-6 py-4">{leave.user?.employeeId}</td>
                                    <td className="px-6 py-4">{leave.user?.name}</td>
                                    <td className="px-6 py-4">{leave.user?.email}</td>
                                    <td className="px-6 py-4">{displayTypeMap[leave.leaveType] || leave.leaveType}</td>
                                    <td className="px-6 py-4">{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{leave.reason}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
                                    <td className="px-6 py-4">
                                        {leave.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(leave._id, 'Approved')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs shadow"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(leave._id, 'Rejected')}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs shadow"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
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

export default LeaveRequests;
