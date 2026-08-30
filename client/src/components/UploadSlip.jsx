import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const UploadSlip = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [employees, setEmployees] = useState([]);
  const [userId, setUserId] = useState('');
  const [month, setMonth] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && user?.role === 'admin') {
      axios
        .get(`${API_BASE_URL}/api/auth/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setEmployees(res.data || []))
        .catch((err) => console.error('Failed to fetch employees for slip upload:', err));
    }
  }, [token, user?.role]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
        <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
        <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
        <p className="text-base text-gray-300">Only HR Administrators have permission to upload salary statements.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !month || !file) {
      setMsg('Please complete all required fields.');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('month', month);
    formData.append('slip', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/salary/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setMsg(res.data?.msg || 'Salary slip uploaded successfully!');
      setIsSuccess(true);
      setMonth('');
      setFile(null);
    } catch (err) {
      setMsg('Upload failed: ' + (err.response?.data?.msg || err.response?.data?.message || err.message));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-6 relative z-10">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-brand-light border border-blue-500/30 mb-4 shadow-inner">
            <span className="material-symbols-rounded text-4xl">upload_file</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2 tracking-tight">
            Upload Salary Statement
          </h2>
          <p className="text-base text-gray-300 font-sans">
            Attach PDF, Image, or Excel spreadsheets (.xlsx) for employee records
          </p>
        </div>

        {msg && (
          <div className={`mb-6 p-4.5 rounded-2xl flex items-center gap-3 text-base font-semibold border ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span className="material-symbols-rounded text-2xl">
              {isSuccess ? 'check_circle' : 'error'}
            </span>
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              Target Employee <span className="text-brand-light">*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="glass-input text-base cursor-pointer bg-dark-800/90 text-white"
            >
              <option value="" className="bg-dark-800 text-gray-400">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} className="bg-dark-800 text-white">
                  {emp.name} ({emp.employeeId || emp.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              Pay Month / Period <span className="text-brand-light">*</span>
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="e.g. June 2025"
              required
              className="glass-input text-base bg-dark-800/90 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5">
              Document File (PDF / Image / Excel .xlsx) <span className="text-brand-light">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full text-base text-gray-200 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-dark-700 file:text-brand-light hover:file:bg-dark-600 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            {isLoading ? (
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-rounded text-2xl">cloud_upload</span>
                Submit Salary Statement
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSlip;
