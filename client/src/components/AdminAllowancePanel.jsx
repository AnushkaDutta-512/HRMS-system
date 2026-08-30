import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AdminAllowancePanel = () => {
    const [requests, setRequests] = useState([]);
    const [remarksMap, setRemarksMap] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProofs, setSelectedProofs] = useState([]);
    const [error, setError] = useState(''); 
    const [message, setMessage] = useState(''); 

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchAllowanceRequests = async () => {
        setError('');
        setMessage(''); 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in as an admin.');
                return;
            }
            const res = await axios.get(`${API_BASE_URL}/api/allowance/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data || []);
        } catch (err) {
            console.error('Failed to load allowance data:', err);
            setError(err.response?.data?.message || 'Failed to load allowance data.');
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAllowanceRequests();
        } else {
            setError('Access Denied: Only administrators can view allowance requests.');
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

    const handleRemarkChange = (id, text) => {
        setRemarksMap((prev) => ({ ...prev, [id]: text }));
    };

    const handleAction = async (id, status) => {
        setError('');
        setMessage('');
        const remarks = remarksMap[id] || '';
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            const res = await axios.put(`${API_BASE_URL}/api/allowance/${id}`,
                { status, remarks },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || `Allowance request ${status} successfully.`);
            fetchAllowanceRequests();
            setRemarksMap((prev) => ({ ...prev, [id]: '' })); 
        } catch (err) {
            console.error('Failed to update status:', err);
            setError(err.response?.data?.message || 'Failed to update status.');
        }
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
                    <span className="material-symbols-rounded text-brand-light text-4xl">account_balance_wallet</span>
                    Allowance Approvals
                </h2>
                <p className="text-base text-gray-300 mt-1">Review and approve financial reimbursement requests</p>
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

            {requests.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-3xl">
                    <p className="text-gray-300 text-lg">No allowance requests submitted.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {requests.map((r) => (
                        <div
                            key={r._id}
                            className="glass-panel p-8 rounded-3xl border border-dark-600/80 shadow-2xl bg-dark-900/85"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-600/60 pb-5 mb-5">
                                <div>
                                    <div className="text-xl font-bold text-white flex items-center gap-3">
                                        {r.userId?.name || 'Employee'}
                                        <span className="text-sm font-mono text-brand-light font-semibold">({r.userId?.email || 'N/A'})</span>
                                    </div>
                                    <div className="text-sm text-gray-300 font-semibold mt-1.5">
                                        Category: <span className="text-white font-bold capitalize">{r.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Requested Amount</div>
                                        <div className="text-2xl font-extrabold font-mono text-emerald-400">₹{r.amount?.toLocaleString('en-IN')}</div>
                                    </div>
                                    <span className={
                                        r.status === 'approved' ? 'badge-green text-sm font-bold' :
                                        r.status === 'rejected' ? 'badge-red text-sm font-bold' : 'badge-purple text-sm font-bold'
                                    }>
                                        {r.status}
                                    </span>
                                </div>
                            </div>

                            {r.reason && (
                                <p className="text-base text-gray-200 mb-4 leading-relaxed">
                                    <strong className="text-gray-400">Reason:</strong> {r.reason}
                                </p>
                            )}

                            {r.proofFiles && r.proofFiles.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedProofs(r.proofFiles);
                                        setModalOpen(true);
                                    }}
                                    className="text-brand-light hover:underline text-sm font-bold flex items-center gap-1.5 mb-5"
                                >
                                    <span className="material-symbols-rounded text-lg">attachment</span>
                                    View Uploaded Proof ({r.proofFiles.length} file{r.proofFiles.length > 1 ? 's' : ''})
                                </button>
                            )}

                            {r.status === 'pending' && (
                                <div className="mt-5 pt-5 border-t border-dark-600/60">
                                    <textarea
                                        className="glass-input text-base bg-dark-800/90 text-white"
                                        rows={3}
                                        placeholder="Add admin evaluation remarks..."
                                        value={remarksMap[r._id] || ''}
                                        onChange={(e) => handleRemarkChange(r._id, e.target.value)}
                                    />
                                    <div className="flex gap-3 mt-4 justify-end">
                                        <button
                                            className="btn-emerald py-2.5 px-5 text-sm font-bold flex items-center gap-1.5"
                                            onClick={() => handleAction(r._id, 'approved')}
                                        >
                                            <span className="material-symbols-rounded text-lg">check</span>
                                            Approve
                                        </button>
                                        <button
                                            className="btn-danger py-2.5 px-5 text-sm font-bold flex items-center gap-1.5"
                                            onClick={() => handleAction(r._id, 'rejected')}
                                        >
                                            <span className="material-symbols-rounded text-lg">close</span>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {r.remarks && r.status !== 'pending' && (
                                <p className="text-sm text-gray-300 mt-3 bg-dark-800/60 p-4 rounded-2xl border border-dark-600/50">
                                    <strong className="text-white">Admin Remarks:</strong> {r.remarks}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative glass-panel bg-dark-800/95 p-8 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-auto border border-dark-600/80">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-rounded text-3xl">close</span>
                        </button>
                        <h2 className="text-3xl font-display font-bold text-white mb-6">Uploaded Allowance Proofs</h2>

                        <div className="flex flex-col items-center space-y-6">
                            {selectedProofs.map((file, index) => {
                                const fileUrl = `${API_BASE_URL}/uploads/${file}`;
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

                                return (
                                    <div key={index} className="w-full text-center">
                                        {isImage ? (
                                            <img
                                                src={fileUrl}
                                                alt={`Proof ${index + 1}`}
                                                className="max-w-full max-h-[65vh] object-contain mx-auto rounded-2xl border border-dark-600/80 shadow-2xl"
                                            />
                                        ) : (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary py-3 px-6 text-sm font-bold inline-flex items-center gap-2"
                                            >
                                                <span className="material-symbols-rounded text-xl">download</span>
                                                Download Proof File {index + 1}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAllowancePanel;