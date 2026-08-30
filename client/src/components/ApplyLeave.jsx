import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const ApplyLeave = () => {
    const [leaveType, setLeaveType] = useState(''); 
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState('');     
    const [reason, setReason] = useState('');
    const [leaveBalance, setLeaveBalance] = useState({}); 
    const [message, setMessage] = useState('');     
    const [error, setError] = useState('');         
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || user?._id;

    const displayTypeMap = {
        sickLeave: 'Sick',
        casualLeave: 'Casual',
        earnedLeave: 'Earned'
    };

    const fetchLeaveBalance = async () => {
        try {
            if (!userId) {
                setError('User session not found.');
                return;
            }
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/leave/balance/${userId}`, {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setIsLoading(false);
                return;
            }

            const res = await axios.post(
                `${API_BASE_URL}/api/leave/apply`,
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
            setMessage(res.data.message || 'Leave application submitted successfully!');
            setError('');
            fetchLeaveBalance(); 
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
        } catch (err) {
            console.error('Error applying leave:', err);
            setError(err.response?.data?.message || 'Error submitting leave application');
            setMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = leaveType && (leaveBalance[leaveType] ?? 0) === 0;

    return (
        <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-6 relative z-10">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-brand-light border border-blue-500/30 mb-4 shadow-inner">
                        <span className="material-symbols-rounded text-4xl">edit_calendar</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2 tracking-tight">Apply for Leave</h2>
                    <p className="text-base text-gray-300">Submit your time-off request for HR evaluation</p>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="leaveType" className="block text-sm font-semibold text-gray-200 mb-2">
                            Leave Category <span className="text-brand-light">*</span>
                        </label>
                        <select
                            id="leaveType"
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value)}
                            className="glass-input cursor-pointer text-base bg-dark-800/90 text-white"
                            required
                        >
                            <option value="" className="bg-dark-800 text-gray-400">-- Select Category --</option>
                            <option value="sickLeave" className="bg-dark-800 text-white">Sick Leave</option>
                            <option value="casualLeave" className="bg-dark-800 text-white">Casual Leave</option>
                            <option value="earnedLeave" className="bg-dark-800 text-white">Earned Leave</option>
                        </select>
                        {leaveType && (
                            <p className="text-sm text-brand-light font-bold mt-2.5 flex items-center gap-1.5">
                                <span className="material-symbols-rounded text-lg">info</span>
                                {leaveBalance[leaveType] ?? 0} {displayTypeMap[leaveType]} leaves remaining
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-200 mb-2">
                                From Date <span className="text-brand-light">*</span>
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="glass-input text-base bg-dark-800/90 text-white cursor-pointer"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-200 mb-2">
                                To Date <span className="text-brand-light">*</span>
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="glass-input text-base bg-dark-800/90 text-white cursor-pointer"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-semibold text-gray-200 mb-2">
                            Reason for Absence <span className="text-brand-light">*</span>
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="glass-input text-base bg-dark-800/90 text-white"
                            rows="4"
                            placeholder="Provide full details regarding your leave request..."
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isDisabled || isLoading} 
                        className={`w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-rounded text-2xl">send</span>
                                Submit Application
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
