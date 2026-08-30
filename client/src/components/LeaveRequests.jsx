import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

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
            const res = await axios.get(`${API_BASE_URL}/api/leave/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data || []);
        } catch (err) {
            console.error('Error fetching leave requests:', err);
            setError(err.response?.data?.message || 'Failed to fetch leave requests.');
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchLeaves();
        } else {
            setError('Access Denied: You must be an administrator to view leave requests.');
        }
    }, [user]); 

    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
                <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
                <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
                <p className="text-base text-gray-300">{error}</p>
            </div>
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
            const res = await axios.put(`${API_BASE_URL}/api/leave/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || `Leave application marked as ${status}.`); 
            fetchLeaves();
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || 'Failed to update leave status.');
        }
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
                    <span className="material-symbols-rounded text-brand-light text-4xl">description</span>
                    Leave Applications
                </h2>
                <p className="text-base text-gray-300 mt-1 font-sans">Review and decision pending employee absence applications</p>
            </div>

            {message && (
                <div className="mb-6 p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-base font-semibold flex items-center gap-3">
                    <span className="material-symbols-rounded text-2xl">check_circle</span>
                    <span>{message}</span>
                </div>
            )}
            
            {error && (
                <div className="mb-6 p-4.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-base font-semibold flex items-center gap-3">
                    <span className="material-symbols-rounded text-2xl">error</span>
                    <span>{error}</span>
                </div>
            )}

            {leaves.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-3xl">
                    <p className="text-gray-300 text-lg">No leave requests currently submitted.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-base text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/95 text-gray-200 text-xs sm:text-sm font-bold uppercase tracking-wider border-b border-dark-600/80">
                                    <th className="px-6 py-5 font-bold">Employee</th> 
                                    <th className="px-6 py-5 font-bold">Category</th>
                                    <th className="px-6 py-5 font-bold">From</th>
                                    <th className="px-6 py-5 font-bold">To</th>
                                    <th className="px-6 py-5 font-bold">Reason</th>
                                    <th className="px-6 py-5 font-bold">Status</th>
                                    <th className="px-6 py-5 font-bold text-right">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-600/50">
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-white text-base leading-snug">{leave.user?.name || 'Employee'}</div>
                                            <div className="text-xs text-brand-light font-mono font-semibold">{leave.user?.employeeId || leave.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-100 font-semibold text-base">
                                            {displayTypeMap[leave.leaveType] || leave.leaveType}
                                        </td>
                                        <td className="px-6 py-5 text-gray-200 font-mono text-sm">{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-gray-200 font-mono text-sm">{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-gray-200 text-sm max-w-xs leading-normal">{leave.reason}</td>
                                        <td className="px-6 py-5">
                                            <span className={
                                                leave.status === 'Approved' ? 'badge-green' :
                                                leave.status === 'Rejected' ? 'badge-red' : 'badge-purple'
                                            }>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {leave.status === 'Pending' ? (
                                                <div className="flex justify-end gap-2.5">
                                                    <button
                                                        onClick={() => updateStatus(leave._id, 'Approved')}
                                                        className="btn-emerald py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                                                    >
                                                        <span className="material-symbols-rounded text-lg">check</span>
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(leave._id, 'Rejected')}
                                                        className="btn-danger py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                                                    >
                                                        <span className="material-symbols-rounded text-lg">close</span>
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-right text-xs text-gray-400 font-mono font-semibold">Processed</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequests;
