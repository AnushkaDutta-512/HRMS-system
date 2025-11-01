
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplyLeave = () => {
    const [leaveType, setLeaveType] = useState(''); 
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState('');     
    const [reason, setReason] = useState('');
    const [leaveBalance, setLeaveBalance] = useState({}); 
    const [message, setMessage] = useState('');     
    const [error, setError] = useState('');         

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

   const displayTypeMap = {
        sickLeave: 'Sick',
        casualLeave: 'Casual',
        earnedLeave: 'Earned'
    };

    const fetchLeaveBalance = async () => {
        try {
            if (!userId) {
                setError('User not logged in or ID not found.');
                return;
            }
            const token = localStorage.getItem('token');
            const res = await axios.get(`https://hrms-system-9nvh.onrender.com/api/leave/balance/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaveBalance(res.data.leaveBalance || {});
        } catch (err) {
            console.error('Error fetching leave balance:', err);
            setError(err.response?.data?.message || 'Error fetching leave balance');
        }
    };

     useEffect(() => {
        if (userId) {
            fetchLeaveBalance();
        }
    }, [userId]);

   
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            const res = await axios.post(
                'https://hrms-system-9nvh.onrender.com/api/leave/apply',
                {
                    userId,
                    leaveType,
                    startDate,
                    endDate,
                    reason
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage(res.data.message);
            setError('');
            fetchLeaveBalance(); 
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
        } catch (err) {
            console.error('Error applying leave:', err);
            setError(err.response?.data?.message || 'Error applying leave');
            setMessage('');
        }
    };
const isDisabled = leaveType && (leaveBalance[leaveType] ?? 0) === 0;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4 text-center">Apply for Leave</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="leaveType" className="block font-medium mb-1">Leave Type</label>
                    <select
                        id="leaveType"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    >
                        <option value="">Select</option>
                        <option value="sickLeave">Sick Leave</option>
                        <option value="casualLeave">Casual Leave</option>
                        <option value="earnedLeave">Earned Leave</option>
                    </select>
                    {leaveType && (
                        <p className="text-sm text-gray-600 mt-1">
                            {leaveBalance[leaveType] ?? 0} {displayTypeMap[leaveType]} leaves remaining
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="startDate" className="block font-medium mb-1">From Date</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block font-medium mb-1">To Date</label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="reason" className="block font-medium mb-1">Reason</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isDisabled} 
                    className={`w-full p-2 rounded ${
                        isDisabled
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Apply
                </button>

                {message && <p className="text-green-600 mt-2">{message}</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default ApplyLeave;
