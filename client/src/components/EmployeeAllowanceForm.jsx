import React, { useState } from 'react';
import axios from 'axios';
const EmployeeAllowanceForm = () => {
   const user = JSON.parse(localStorage.getItem('user'));
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Petrol'); 
    const [customType, setCustomType] = useState(''); 
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState([]);
const [success, setSuccess] = useState(''); 
    const [error, setError] = useState('');     
const handleSubmit = async (e) => {
        e.preventDefault(); 
        setSuccess('');
        setError('');
        const allowanceType = type === 'Other' ? customType : type;
const formData = new FormData();
       formData.append('userId', user.id);
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
                return; }

             await axios.post('https://hrms-system-9nvh.onrender.com/api/allowance/apply', formData, {
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
            setSuccess(' Allowance request submitted successfully!');
        } catch (err) {
            
            console.error('Error submitting request:', err);
            
            setError(err.response?.data?.message || '❌ Error submitting request.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white border border-blue-100 p-8 rounded-3xl shadow-xl"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-[#002855]">
                    Apply for Allowance
                </h2>

                {success && (
                    <p className="text-green-700 bg-green-100 text-sm p-3 mb-5 rounded-lg border border-green-200 text-center">
                        {success}
                    </p>
                )}
                {error && (
                    <p className="text-red-700 bg-red-100 text-sm p-3 mb-5 rounded-lg border border-red-200 text-center">
                        {error}
                    </p>
                )}

                <div className="mb-5">
                    <label htmlFor="amount" className="block text-sm font-semibold mb-1 text-gray-700">
                        Amount (₹)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="allowanceType" className="block text-sm font-semibold mb-1 text-gray-700">
                        Allowance Type
                    </label>
                    <select
                        id="allowanceType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                        required
                    >
                        <option value="" disabled>
                            -- Select allowance type --
                        </option>
                        <option value="Petrol">Petrol</option>
                        <option value="Internet">Internet</option>
                        <option value="Meal">Meal</option>
                        <option value="Travel">Travel</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {type === 'Other' && (
                    <div className="mb-5">
                        <label htmlFor="customType" className="block text-sm font-semibold mb-1 text-gray-700">
                            Custom Type
                        </label>
                        <input
                            id="customType"
                            type="text"
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value)}
                            placeholder="Enter custom allowance type"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                            required
                        />
                    </div>
                )}

                <div className="mb-6">
                    <label htmlFor="reason" className="block text-sm font-semibold mb-1 text-gray-700">
                        Reason (optional)
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                        rows={3}
                        placeholder="(Optional) Reason for allowance"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="proofFiles" className="block text-sm font-semibold mb-1 text-gray-700">
                        Upload Proof (bills, receipts, tickets)
                    </label>
                    <input
                        id="proofFiles"
                        type="file"
                        multiple 
                        onChange={(e) => setFiles([...e.target.files])} 
                        className="w-full border rounded-lg px-4 py-2 file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-700 file:font-semibold file:px-4 file:py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#0466c8] text-white py-3 rounded-xl font-semibold hover:bg-[#0353a4] transition"
                >
                    ✅ Submit Request
                </button>
            </form>
        </div>
    );
};

export default EmployeeAllowanceForm;
