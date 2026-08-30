import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AdminDashboard = () => {
   const [currentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            return null;
        }
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [slipsModalOpen, setSlipsModalOpen] = useState(false);
    const [salarySlips, setSalarySlips] = useState([]);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedSlipDetail, setSelectedSlipDetail] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const fetchEmployees = useCallback(async (token) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/auth/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setError(err.response?.data?.message || 'Failed to fetch employees.');
            setLoading(false);
        }
    }, [setError, setLoading, setEmployees]); 

    useEffect(() => {
        setMessage('');
        setError('');
        const token = localStorage.getItem('token');

        if (currentUser?.role === 'admin' && token) {
            fetchEmployees(token);
        } else if (!currentUser || currentUser?.role !== 'admin') {
            setError('Access Denied: Only administrators can view this dashboard.');
            setLoading(false);
        }
    }, [currentUser, fetchEmployees]); 

    const handleDelete = (id) => {
        setEmployeeToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        setError('');
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            await axios.delete(`${API_BASE_URL}/api/auth/employee/${employeeToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Employee deleted successfully!');
            setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete));
            setEmployeeToDelete(null);
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError(err.response?.data?.message || 'Failed to delete employee.');
        }
    };

    const handleEdit = (emp) => {
        setEditing(emp);
        setEditData({
            name: emp.name,
            salary: emp.salary,
            phone: emp.phone,
            address: emp.address,
            education: emp.education,
            family: emp.family || [],
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        setError('');
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            const res = await axios.put(`${API_BASE_URL}/api/profile/update/${editing._id}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message || 'Employee profile updated successfully!');
            setShowEditModal(false);
            fetchEmployees(token); 
        } catch (err) {
            console.error('Failed to update employee:', err);
            setError(err.response?.data?.message || 'Update failed.');
        }
    };

    const handleFamilyChange = (index, field, value) => {
        const updated = [...editData.family];
        updated[index][field] = value;
        setEditData({ ...editData, family: updated });
    };

    const addFamilyMember = () => {
        setEditData((prev) => ({
            ...prev,
            family: [...(prev.family || []), { name: '', relation: '', contact: '' }],
        }));
    };

    const removeFamilyMember = (index) => {
        const updatedFamily = [...editData.family];
        updatedFamily.splice(index, 1);
        setEditData({ ...editData, family: updatedFamily });
    };

    const handleViewSlips = async (userId, name) => {
        setError('');
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            const res = await axios.get(`${API_BASE_URL}/api/salary/slips/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSalarySlips(res.data || []);
            setSelectedEmployeeName(name);
            setSelectedEmployeeId(userId);
            setSlipsModalOpen(true);
        } catch (err) {
            console.error('Error fetching slips:', err);
            setError(err.response?.data?.message || 'Could not fetch slips.');
        }
    };

    if (error && error.includes('Access Denied')) {
        return (
            <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
                <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
                <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
                <p className="text-sm text-gray-400">{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="py-16 text-center">
                <p className="text-gray-400 font-sans text-lg">Loading workforce directory...</p>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">HR Control Center</h1>
                    <p className="text-sm text-gray-400 mt-1">Directory and record management for all registered personnel</p>
                </div>
            </div>

            {message && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-rounded text-xl">check_circle</span>
                    <span>{message}</span>
                </div>
            )}
            
            {error && !error.includes('Access Denied') && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-rounded text-xl">error</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-base text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-800/95 text-gray-200 text-xs font-bold uppercase tracking-widest border-b border-dark-600/80">
                                <th className="px-6 py-5">Employee</th>
                                <th className="px-6 py-5">Email Address</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-600/50">
                            {employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-dark-700/50 transition-colors">
                                    <td className="px-6 py-5 font-medium text-white flex items-center gap-3">
                                        {emp.profilePic ? (
                                            <img
                                                src={`${API_BASE_URL}/uploads/${emp.profilePic}`}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-brand-DEFAULT shadow-md shadow-brand-DEFAULT/20"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-gray-300 shadow-inner">
                                                <span className="material-symbols-rounded text-xl">person</span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-white text-base leading-snug">{emp.name}</div>
                                            <div className="text-xs text-brand-light font-mono font-semibold tracking-wide">{emp.employeeId || emp._id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-100 font-mono text-sm tracking-wide">{emp.email}</td>
                                    <td className="px-6 py-5 capitalize">
                                        <span className={emp.role === 'admin' ? 'badge-purple text-xs font-bold' : 'badge-blue text-xs font-bold'}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <button
                                                onClick={() => handleViewSlips(emp._id, emp.name)}
                                                className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-rounded text-base">receipt_long</span>
                                                Slips
                                            </button>
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-rounded text-base">edit</span>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp._id)}
                                                className="btn-danger py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-rounded text-base">delete</span>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start pt-12 z-50 p-4">
                    <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 md:p-8 w-full max-w-3xl relative border border-dark-600/80 shadow-2xl max-h-[88vh] overflow-y-auto">
                        <button
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowEditModal(false)}
                        >
                            <span className="material-symbols-rounded text-2xl">close</span>
                        </button>

                        <h2 className="text-2xl font-display font-bold text-white mb-6">Edit Employee Profile</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['name', 'salary', 'phone', 'address', 'education'].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs font-semibold capitalize text-gray-400 mb-1">{field}</label>
                                    <input
                                        type={field === 'salary' ? 'number' : 'text'}
                                        name={field}
                                        value={editData[field] || ''}
                                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                        className="glass-input text-sm"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-dark-600/60">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-display font-semibold text-white">Family Members</h3>
                                <button
                                    type="button"
                                    onClick={addFamilyMember}
                                    className="text-xs text-brand-light hover:underline flex items-center gap-1 font-medium"
                                >
                                    <span className="material-symbols-rounded text-base">add</span> Add Member
                                </button>
                            </div>

                            {(editData.family || []).map((f, i) => (
                                <div key={i} className="grid grid-cols-3 gap-3 mb-3 items-center">
                                    {['name', 'relation', 'contact'].map((field) => (
                                        <input
                                            key={field}
                                            type="text"
                                            name={field}
                                            value={f[field] || ''}
                                            onChange={(e) => handleFamilyChange(i, field, e.target.value)}
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            className="glass-input text-xs py-2"
                                        />
                                    ))}
                                    {editData.family.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFamilyMember(i)}
                                            className="text-red-400 hover:text-red-300 text-xs flex items-center justify-center p-1"
                                        >
                                            <span className="material-symbols-rounded text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-8 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="btn-secondary text-xs py-2 px-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="btn-primary text-xs py-2 px-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slips Modal */}
            {slipsModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start pt-12 z-50 p-4">
                    <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative max-h-[85vh] overflow-y-auto border border-dark-600/80 shadow-2xl">
                        <button
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setSlipsModalOpen(false)}
                        >
                            <span className="material-symbols-rounded text-2xl">close</span>
                        </button>

                        <h2 className="text-2xl font-display font-bold text-white mb-2">
                            Salary Slips – {selectedEmployeeName}
                        </h2>
                        <p className="text-xs text-gray-400 mb-6">Manage monthly statements for this employee</p>

                        {salarySlips.length > 0 ? (
                            <div className="space-y-3">
                                {salarySlips.map((slip, idx) => (
                                    <div
                                        key={slip._id || idx}
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-dark-900/60 p-4 rounded-2xl border border-dark-600/60 gap-3"
                                    >
                                        <div>
                                            <span className="font-semibold text-white block text-sm">{slip.month}</span>
                                            <span className="text-xs text-emerald-400 font-mono font-bold">
                                                Net: {slip.netSalaryFormatted || `₹${slip.netSalary}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {slip.details && slip.details.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSlipDetail(slip)}
                                                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-rounded text-base">visibility</span>
                                                    Details
                                                </button>
                                            )}
                                            <a
                                                href={`${API_BASE_URL}/api/salary/download-pdf/${selectedEmployeeId}/${encodeURIComponent(slip.month)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                                            >
                                                <span className="material-symbols-rounded text-base">picture_as_pdf</span>
                                                PDF
                                            </a>
                                            <a
                                                href={`${API_BASE_URL}/api/salary/download-excel/${selectedEmployeeId}/${encodeURIComponent(slip.month)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-emerald py-1.5 px-3 text-xs flex items-center gap-1"
                                            >
                                                <span className="material-symbols-rounded text-base">table_view</span>
                                                Excel
                                            </a>
                                            {slip.filePath && (
                                                <a
                                                    href={`${API_BASE_URL}/uploads/${slip.filePath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-dark-700 hover:bg-dark-600 text-gray-200 py-1.5 px-3 rounded-xl border border-dark-600 transition-colors text-xs flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-rounded text-base">attachment</span>
                                                    Attachment
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No salary slips found for this employee.</p>
                        )}

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-600/60 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                                <a
                                    href={`${API_BASE_URL}/api/salary/download-pdf/${selectedEmployeeId}/all`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-light hover:underline font-semibold text-xs flex items-center gap-1"
                                >
                                    <span className="material-symbols-rounded text-base">picture_as_pdf</span> Export All PDF
                                </a>
                                <a
                                    href={`${API_BASE_URL}/api/salary/download-excel/${selectedEmployeeId}/all`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:underline font-semibold text-xs flex items-center gap-1"
                                >
                                    <span className="material-symbols-rounded text-base">table_view</span> Export All Excel
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSlipsModalOpen(false)}
                                className="btn-secondary py-1.5 px-4 text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slip Detail Modal */}
            {selectedSlipDetail && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
                    <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 w-full max-w-md relative border border-dark-600/80 shadow-2xl">
                        <button
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setSelectedSlipDetail(null)}
                        >
                            <span className="material-symbols-rounded text-2xl">close</span>
                        </button>
                        <h3 className="text-xl font-display font-bold text-white mb-1">
                            Breakdown – {selectedSlipDetail.month}
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Employee: {selectedEmployeeName}
                        </p>
                        
                        <div className="border border-dark-600/60 rounded-2xl overflow-hidden bg-dark-900/60 mb-5">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-dark-700/50 text-gray-300 text-xs border-b border-dark-600/60">
                                        <th className="p-3 font-semibold">Component</th>
                                        <th className="p-3 font-semibold text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-600/40">
                                    {selectedSlipDetail.details.map((d, i) => (
                                        <tr key={i} className="hover:bg-dark-700/30">
                                            <td className="p-3 font-medium text-gray-200">{d.component}</td>
                                            <td className="p-3 text-right font-mono text-gray-100">{d.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-2">
                            <a
                                href={`${API_BASE_URL}/api/salary/download-pdf/${selectedEmployeeId}/${encodeURIComponent(selectedSlipDetail.month)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                            >
                                <span className="material-symbols-rounded text-base">picture_as_pdf</span> PDF
                            </a>
                            <a
                                href={`${API_BASE_URL}/api/salary/download-excel/${selectedEmployeeId}/${encodeURIComponent(selectedSlipDetail.month)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-emerald py-1.5 px-3 text-xs flex items-center gap-1"
                            >
                                <span className="material-symbols-rounded text-base">table_view</span> Excel
                            </a>
                            <button
                                type="button"
                                onClick={() => setSelectedSlipDetail(null)}
                                className="btn-secondary py-1.5 px-3 text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
                    <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 w-full max-w-sm relative text-center border border-dark-600/80 shadow-2xl">
                        <span className="material-symbols-rounded text-4xl text-red-400 mb-2">warning</span>
                        <h2 className="text-xl font-display font-bold text-white mb-2">Confirm Deletion</h2>
                        <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="btn-secondary text-xs py-2 px-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="btn-danger text-xs py-2 px-4"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;