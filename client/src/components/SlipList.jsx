import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const SlipList = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.employeeId || user?.id || user?._id;

  const fetchSlips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!userId) {
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/salary/slips/${userId}`, {
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
  };

  useEffect(() => { 
    fetchSlips(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadExcel = (month) => {
    window.open(`${API_BASE_URL}/api/salary/download-excel/${userId}/${encodeURIComponent(month)}`, '_blank');
  };

  const handleDownloadPdf = (month) => {
    window.open(`${API_BASE_URL}/api/salary/download-pdf/${userId}/${encodeURIComponent(month)}`, '_blank');
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-rounded text-brand-light text-3xl">receipt_long</span>
            Salary Slips
          </h2>
          <p className="text-sm text-gray-300 mt-1 font-sans">Manage monthly statements for this employee</p>
        </div>
        {slips.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleDownloadPdf('all')}
              className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-rounded text-lg">picture_as_pdf</span>
              Export All (PDF)
            </button>
            <button
              onClick={() => handleDownloadExcel('all')}
              className="btn-emerald py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-rounded text-lg">table_view</span>
              Export All (Excel)
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="glass-panel p-8 text-center rounded-3xl">
          <p className="text-gray-300 text-sm">Loading salary statements...</p>
        </div>
      ) : errorMsg ? (
        <div className="glass-panel p-8 text-center rounded-3xl">
          <p className="text-gray-200 text-sm mb-1">{errorMsg}</p>
          <p className="text-xs text-gray-400">Contact HR if you believe this is an error.</p>
        </div>
      ) : slips.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-3xl">
          <p className="text-gray-300 text-sm">No salary slips available at this time.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-800/95 text-gray-300 text-xs font-bold uppercase tracking-wider border-b border-dark-600/80">
                  <th className="px-5 py-3.5 font-bold">Pay Month</th>
                  <th className="px-5 py-3.5 font-bold">Net Salary</th>
                  <th className="px-5 py-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50 text-sm">
                {slips.map((slip, i) => (
                  <tr key={slip._id || i} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-sm">{slip.month}</td>
                    <td className="px-5 py-3.5 font-extrabold text-emerald-400 font-mono text-sm">
                      {slip.netSalaryFormatted || `₹${slip.netSalary?.toLocaleString() || slip.netSalary}`}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                          onClick={() => setSelectedSlip(slip)}
                        >
                          <span className="material-symbols-rounded text-base">visibility</span>
                          Details
                        </button>
                        <button
                          className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                          onClick={() => handleDownloadPdf(slip.month)}
                        >
                          <span className="material-symbols-rounded text-base">picture_as_pdf</span>
                          PDF
                        </button>
                        <button
                          className="btn-emerald py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
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
                            className="bg-dark-700 hover:bg-dark-600 text-gray-200 py-1.5 px-3 rounded-lg border border-dark-600 transition-colors text-xs font-bold flex items-center gap-1.5"
                          >
                            <span className="material-symbols-rounded text-base">attachment</span>
                            Attachment
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 sm:p-8 w-full max-w-xl relative border border-dark-600/80 shadow-2xl">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSelectedSlip(null)}
            >
              <span className="material-symbols-rounded text-2xl">close</span>
            </button>
            
            <div className="mb-5">
              <h3 className="text-xl font-display font-bold text-white mb-1 tracking-tight">
                Salary Statement
              </h3>
              <p className="text-xs text-gray-300">
                Period: <span className="text-brand-light font-bold">{selectedSlip.month}</span> | Employee: <span className="text-white font-semibold">{selectedSlip.employeeName || user?.name}</span> ({selectedSlip.empId || userId})
              </p>
            </div>

            {selectedSlip?.details?.length > 0 ? (
              <div className="space-y-4">
                <div className="border border-dark-600/80 rounded-2xl overflow-hidden bg-dark-900/80 shadow-inner">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-dark-700/80 text-gray-300 text-xs font-bold border-b border-dark-600/80">
                        <th className="px-4 py-2.5 font-bold">Component</th>
                        <th className="px-4 py-2.5 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/50">
                      {selectedSlip.details.map((d, idx) => (
                        <tr key={idx} className="hover:bg-dark-700/40">
                          <td className="px-4 py-2.5 font-semibold text-white">{d.component}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-200">{d.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-xl">
                  <span className="font-bold text-white text-sm">Net Payable Salary:</span>
                  <span className="font-bold text-xl text-emerald-400 font-mono">
                    {selectedSlip.netSalaryFormatted || `₹${selectedSlip.netSalary}`}
                  </span>
                </div>

                <div className="flex justify-end gap-2.5 pt-1 flex-wrap">
                  <button
                    onClick={() => handleDownloadPdf(selectedSlip.month)}
                    className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-rounded text-lg">picture_as_pdf</span>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownloadExcel(selectedSlip.month)}
                    className="btn-emerald py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-rounded text-lg">table_view</span>
                    Download Excel
                  </button>
                  {selectedSlip.filePath && (
                    <a
                      href={`${API_BASE_URL}/uploads/${selectedSlip.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-rounded text-lg">attachment</span>
                      Attachment
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
