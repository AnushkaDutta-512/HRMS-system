import React, { useState } from 'react';
import axios from 'axios';

const EmployeeAllowanceForm = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Petrol');
  const [customType, setCustomType] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allowanceType = type === 'Other' ? customType : type;

    try {
      await axios.post('http://localhost:3036/api/allowance/apply', {
        userId: user.id,
        amount,
        reason,
        type: allowanceType,
      });

      setAmount('');
      setReason('');
      setType('Petrol');
      setCustomType('');
      setSuccess('🎉 Allowance request submitted successfully!');
    } catch (error) {
      alert('❌ Error submitting request');
      console.error(error);
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

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Allowance Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
            required
          >
            <option value="" disabled>-- Select allowance type --</option>
            <option value="Petrol">Petrol</option>
            <option value="Internet">Internet</option>
            <option value="Meal">Meal</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {type === 'Other' && (
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Custom Type</label>
            <input
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
          <label className="block text-sm font-semibold mb-1 text-gray-700">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
            rows={3}
            placeholder="(Optional) Reason for allowance"
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
