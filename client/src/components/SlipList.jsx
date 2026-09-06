import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { Link } from 'react-router-dom';

const SlipList = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [employees, setEmployees] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.employeeId || user?.id || user?._id;
  const [targetUserId, setTargetUserId] = useState(currentUserId || '');

  const fetchSlips = useCallback(async (uid) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      if (!uid) {
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/salary/slips/${uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlips(res.data || []);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching slips:', err);
      setErrorMsg(err.response?.data?.message || 'No salary slips available.');
      setSlips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user?.role === 'admin' && token) {
      axios
        .get(`${API_BASE_URL}/api/auth/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setEmployees(res.data || []);
        })
        .catch((err) => console.error('Failed to fetch employees list:', err));
    }
  }, [user?.role]);

  useEffect(() => {
    if (targetUserId) {
      fetchSlips(targetUserId);
    }
  }, [targetUserId, fetchSlips]);

  const handleDownloadExcel = (month) => {
    window.open(`${API_BASE_URL}/api/salary/download-excel/${targetUserId}/${encodeURIComponent(month)}`, '_blank');
  };

  const handleDownloadPdf = (month) => {
    window.open(`${API_BASE_URL}/api/salary/download-pdf/${targetUserId}/${encodeURIComponent(month)}`, '_blank');
  };

  const latestSlip = slips.length > 0 ? slips[0] : null;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-rounded text-brand-light text-4xl">receipt_long</span>
            Salary Statements
          </h2>
          <p className="text-base text-gray-300 mt-1 font-sans">
            Official monthly payslip records and downloadable financial statements
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {user?.role === 'admin' && (
            <Link
              to="/upload"
              className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-rounded text-lg text-brand-light">upload_file</span>
              Upload Payslip
            </Link>
          )}

          {slips.length > 0 && (
            <>
              <button
                onClick={() => handleDownloadPdf('all')}
                className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-rounded text-lg">picture_as_pdf</span>
                Export All (PDF)
              </button>
              <button
                onClick={() => handleDownloadExcel('all')}
                className="btn-emerald py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span className="material-symbols-rounded text-lg">table_view</span>
                Export All (Excel)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Admin Employee Selector Banner */}
      {user?.role === 'admin' && (
        <div className="glass-panel p-5 rounded-3xl mb-8 border border-dark-600/80 bg-dark-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-DEFAULT/20 text-brand-light flex items-center justify-center border border-brand-DEFAULT/30">
              <span className="material-symbols-rounded text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">HR Administration Mode</div>
              <div className="text-xs text-gray-400">Select any employee to review their payslip history</div>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="glass-input text-sm py-2 px-3 bg-dark-800 text-white cursor-pointer font-medium"
            >
              <option value={currentUserId} className="bg-dark-800">
                My Profile ({user?.name || 'Admin'})
              </option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.employeeId || emp._id} className="bg-dark-800">
                  {emp.name} ({emp.employeeId || emp.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      {slips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="glass-panel p-5 rounded-3xl border border-dark-600/80 bg-dark-900/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Statements</span>
              <span className="material-symbols-rounded text-brand-light text-2xl">folder_open</span>
            </div>
            <div className="text-2xl font-display font-extrabold text-white mt-2">
              {slips.length} <span className="text-xs font-medium text-gray-400">Months</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-dark-600/80 bg-dark-900/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Latest Net Salary</span>
              <span className="material-symbols-rounded text-emerald-400 text-2xl">payments</span>
            </div>
            <div className="text-2xl font-display font-extrabold text-emerald-400 font-mono mt-2">
              {latestSlip?.netSalaryFormatted || `₹${latestSlip?.netSalary?.toLocaleString('en-IN')}`}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-dark-600/80 bg-dark-900/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Employee Profile</span>
              <span className="material-symbols-rounded text-purple-400 text-2xl">badge</span>
            </div>
            <div className="text-sm font-bold text-white mt-2 truncate">
              {latestSlip?.employeeName || user?.name}
            </div>
            <div className="text-xs text-brand-light font-mono">
              ID: {latestSlip?.empId || targetUserId}
            </div>
          </div>
        </div>
      )}

      {/* Main Table / State Render */}
      {loading ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-dark-600/80">
          <div className="w-12 h-12 border-3 border-brand-DEFAULT/30 border-t-brand-DEFAULT rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-base font-semibold">Loading salary statements...</p>
        </div>
      ) : errorMsg && slips.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-dark-600/80">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <span className="material-symbols-rounded text-3xl">info</span>
          </div>
          <p className="text-gray-200 text-base font-bold mb-1">{errorMsg}</p>
          <p className="text-xs text-gray-400">Please verify the employee ID or contact the HR department.</p>
        </div>
      ) : slips.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-dark-600/80">
          <div className="w-14 h-14 rounded-2xl bg-brand-DEFAULT/10 text-brand-light flex items-center justify-center mx-auto mb-4 border border-brand-DEFAULT/20">
            <span className="material-symbols-rounded text-3xl">receipt_long</span>
          </div>
          <p className="text-gray-200 text-base font-bold mb-1">No salary slips found for this period.</p>
          <p className="text-xs text-gray-400">Statements will appear here once processed by payroll.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-800/95 text-gray-300 text-xs font-bold uppercase tracking-wider border-b border-dark-600/80">
                  <th className="px-6 py-4.5 font-bold">Pay Month</th>
                  <th className="px-6 py-4.5 font-bold">Employee ID</th>
                  <th className="px-6 py-4.5 font-bold">Net Salary</th>
                  <th className="px-6 py-4.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50 text-sm">
                {slips.map((slip, i) => (
                  <tr key={slip._id || i} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-white text-base">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-DEFAULT"></span>
                        <span>{slip.month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 font-mono text-gray-300 text-sm font-semibold">
                      {slip.empId || targetUserId}
                    </td>
                    <td className="px-6 py-4.5 font-extrabold text-emerald-400 font-mono text-lg">
                      {slip.netSalaryFormatted || `₹${Number(slip.netSalary).toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
                          onClick={() => setSelectedSlip(slip)}
                        >
                          <span className="material-symbols-rounded text-base">visibility</span>
                          Details
                        </button>
                        <button
                          className="btn-primary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                          onClick={() => handleDownloadPdf(slip.month)}
                        >
                          <span className="material-symbols-rounded text-base">picture_as_pdf</span>
                          PDF
                        </button>
                        <button
                          className="btn-emerald py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                          onClick={() => handleDownloadExcel(slip.month)}
                        >
                          <span className="material-symbols-rounded text-base">table_view</span>
                          Excel
                        </button>
                        {slip.filePath && (
                          <a
                            href={`${API_BASE_URL}/uploads/${slip.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-dark-700 hover:bg-dark-600 text-gray-200 py-2 px-3.5 rounded-lg border border-dark-600 transition-colors text-xs font-bold flex items-center gap-1.5"
                          >
                            <span className="material-symbols-rounded text-base">attachment</span>
                            File
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Breakdown Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 sm:p-8 w-full max-w-xl relative border border-dark-600/80 shadow-2xl">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSelectedSlip(null)}
            >
              <span className="material-symbols-rounded text-2xl">close</span>
            </button>
            
            <div className="mb-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-DEFAULT/20 text-brand-light flex items-center justify-center border border-brand-DEFAULT/30 shrink-0">
                <span className="material-symbols-rounded text-2xl">receipt_long</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-1 tracking-tight">
                  Official Salary Breakdown
                </h3>
                <p className="text-xs text-gray-300">
                  Pay Period: <span className="text-brand-light font-bold">{selectedSlip.month}</span> | Employee: <span className="text-white font-semibold">{selectedSlip.employeeName || user?.name}</span> ({selectedSlip.empId || targetUserId})
                </p>
              </div>
            </div>

            {selectedSlip?.details?.length > 0 ? (
              <div className="space-y-5">
                <div className="border border-dark-600/80 rounded-2xl overflow-hidden bg-dark-900/80 shadow-inner">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-dark-700/80 text-gray-300 text-xs font-bold border-b border-dark-600/80">
                        <th className="px-5 py-3 font-bold">Salary Component</th>
                        <th className="px-5 py-3 font-bold text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/50">
                      {selectedSlip.details.map((d, idx) => (
                        <tr key={idx} className="hover:bg-dark-700/40 transition-colors">
                          <td className="px-5 py-3 font-semibold text-white">{d.component}</td>
                          <td className="px-5 py-3 text-right font-mono font-bold text-gray-200">
                            {typeof d.amount === 'number' ? `₹${d.amount.toLocaleString('en-IN')}` : d.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-emerald-500/15 border border-emerald-500/30 p-5 rounded-2xl">
                  <span className="font-bold text-white text-base">Net Payable Salary:</span>
                  <span className="font-extrabold text-2xl text-emerald-400 font-mono">
                    {selectedSlip.netSalaryFormatted || `₹${Number(selectedSlip.netSalary).toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2 flex-wrap">
                  <button
                    onClick={() => handleDownloadPdf(selectedSlip.month)}
                    className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                  >
                    <span className="material-symbols-rounded text-lg">picture_as_pdf</span>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownloadExcel(selectedSlip.month)}
                    className="btn-emerald py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <span className="material-symbols-rounded text-lg">table_view</span>
                    Download Excel
                  </button>
                  {selectedSlip.filePath && (
                    <a
                      href={`${API_BASE_URL}/uploads/${selectedSlip.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-rounded text-lg">attachment</span>
                      Original Attachment
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm">No component details available for this period.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlipList;
