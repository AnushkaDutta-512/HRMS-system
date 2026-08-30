import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const EmployeeAllowanceForm = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Petrol'); 
    const [customType, setCustomType] = useState(''); 
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState([]);
    const [success, setSuccess] = useState(''); 
    const [error, setError] = useState('');     
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setSuccess('');
        setError('');
        setIsLoading(true);

        const allowanceType = type === 'Other' ? customType : type;
        const formData = new FormData();
        formData.append('userId', user?.id || user?._id);
        formData.append('amount', amount);
        formData.append('reason', reason);
        formData.append('type', allowanceType);
        for (let i = 0; i < files.length; i++) {
            formData.append('proofFiles', files[i]);
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setIsLoading(false);
                return;
            }

            await axios.post(`${API_BASE_URL}/api/allowance/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                    Authorization: `Bearer ${token}`       
                },
            });

            setAmount('');
            setReason('');
            setType('Petrol');
            setCustomType('');
            setFiles([]);
            setSuccess('Allowance request submitted successfully!');
        } catch (err) {
            console.error('Error submitting request:', err);
            setError(err.response?.data?.message || 'Error submitting allowance request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative z-10">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 mb-4 shadow-inner">
                        <span className="material-symbols-rounded text-4xl">credit_card</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2 tracking-tight">
                        Apply for Allowance
                    </h2>
                    <p className="text-base text-gray-300">Submit expense reimbursement claims for HR verification</p>
                </div>

                {success && (
                    <div className="mb-6 p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-base font-semibold flex items-center gap-3">
                        <span className="material-symbols-rounded text-2xl">check_circle</span>
                        <span>{success}</span>
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
                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-200 mb-2">
                            Claim Amount (INR) <span className="text-brand-light">*</span>
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 1500"
                            className="glass-input text-base bg-dark-800/90 text-white font-mono"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="allowanceType" className="block text-sm font-semibold text-gray-200 mb-2">
                            Allowance Category <span className="text-brand-light">*</span>
                        </label>
                        <select
                            id="allowanceType"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="glass-input cursor-pointer text-base bg-dark-800/90 text-white"
                            required
                        >
                            <option value="Petrol" className="bg-dark-800 text-white">Petrol / Fuel</option>
                            <option value="Internet" className="bg-dark-800 text-white">Internet & Broadband</option>
                            <option value="Meal" className="bg-dark-800 text-white">Meal & Refreshments</option>
                            <option value="Travel" className="bg-dark-800 text-white">Official Travel</option>
                            <option value="Other" className="bg-dark-800 text-white">Other</option>
                        </select>
                    </div>

                    {type === 'Other' && (
                        <div>
                            <label htmlFor="customType" className="block text-sm font-semibold text-gray-200 mb-2">
                                Custom Allowance Category <span className="text-brand-light">*</span>
                            </label>
                            <input
                                id="customType"
                                type="text"
                                value={customType}
                                onChange={(e) => setCustomType(e.target.value)}
                                placeholder="Specify custom category"
                                className="glass-input text-base bg-dark-800/90 text-white"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="reason" className="block text-sm font-semibold text-gray-200 mb-2">
                            Justification / Description (optional)
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="glass-input text-base bg-dark-800/90 text-white"
                            rows="4"
                            placeholder="Explain the purpose for this reimbursement request..."
                        />
                    </div>

                    <div>
                        <label htmlFor="proofFiles" className="block text-sm font-semibold text-gray-200 mb-2">
                            Proof Documentation (Receipts, Tickets, Bills)
                        </label>
                        <input
                            id="proofFiles"
                            type="file"
                            multiple 
                            onChange={(e) => setFiles([...e.target.files])} 
                            className="w-full text-base text-gray-200 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-dark-700 file:text-brand-light hover:file:bg-dark-600 cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-emerald py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl"
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-rounded text-2xl">send</span>
                                Submit Allowance Claim
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeAllowanceForm;
