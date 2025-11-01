import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
const AdminDashboard = () => {
   const [currentUser, setCurrentUser] = useState(() => {
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
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const fetchEmployees = useCallback(async (token) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('https://hrms-system-9nvh.onrender.com/api/auth/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
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
            setError('⛔ Access Denied: Only administrators can view this dashboard.');
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
            await axios.delete(`https://hrms-system-9nvh.onrender.com/api/auth/employee/${employeeToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Employee deleted successfully!');
            setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete));
            setEmployeeToDelete(null);
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError(err.response?.data?.message || '❌ Failed to delete employee.');
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
            const res = await axios.put(`https://hrms-system-9nvh.onrender.com/api/profile/update/${editing._id}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message || '✅ Employee updated successfully!');
            setShowEditModal(false);
            fetchEmployees(token); 
        } catch (err) {
            console.error('Failed to update employee:', err);
            setError(err.response?.data?.message || '❌ Update failed.');
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
            const res = await axios.get(`https://hrms-system-9nvh.onrender.com/api/salary/${userId}/slips`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSalarySlips(res.data || []);
            setSelectedEmployeeName(name);
            setSlipsModalOpen(true);
        } catch (err) {
            console.error('Error fetching slips:', err);
            setError(err.response?.data?.message || '❌ Could not fetch slips.');
        }
    };

    if (error && error.includes('Access denied')) {
        return <p className="text-red-600 text-center mt-4">{error}</p>;
    }

    if (loading) return <p className="text-center mt-4 text-gray-600">Loading employees...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">HR Dashboard – All Employees</h1>

            {message && <p className="text-green-600 text-center font-medium mb-4">{message}</p>}
            {error && !error.includes('Access denied') && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full text-sm text-left">
                    <thead>
                        <tr className="bg-blue-100 text-blue-800 uppercase text-xs">
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp._id} className="border-t hover:bg-blue-50">
                                <td className="px-6 py-3 font-medium text-gray-800 flex items-center gap-2">
                                    {emp.profilePic && (
                                        <img
                                            src={`http://localhost:3036/uploads/${emp.profilePic}`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border"
                                        />
                                    )}
                                    {emp.name}
                                </td>
                                <td className="px-6 py-3">{emp.email}</td>
                                <td className="px-6 py-3 capitalize">{emp.role}</td>
                                <td className="px-6 py-3 space-x-4">
                                    <button
                                        onClick={() => handleViewSlips(emp._id, emp.name)}
                                        className="text-green-600 hover:underline text-sm font-medium"
                                    >
                                       
                                    </button>
                                    <span className="inline-block w-px h-4 bg-gray-300"></span>
                                    <button
                                        onClick={() => handleEdit(emp)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(emp._id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-16 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl relative">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">Edit Employee</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['name', 'salary', 'phone', 'address', 'education'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold capitalize text-gray-700">{field}</label>
                                    <input
                                        type={field === 'salary' ? 'number' : 'text'}
                                        name={field}
                                        value={editData[field] || ''}
                                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            ))}
                        </div>

                        <h3 className="mt-6 text-lg font-semibold text-blue-700 flex justify-between items-center">
                            Family Members
                            <button
                                type="button"
                                onClick={addFamilyMember}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                + Add Member
                            </button>
                        </h3>

                        {(editData.family || []).map((f, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 mb-2">
                                {['name', 'relation', 'contact'].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        name={field}
                                        value={f[field] || ''}
                                        onChange={(e) => handleFamilyChange(i, field, e.target.value)}
                                        placeholder={field}
                                        className="px-3 py-2 border rounded-md"
                                    />
                                ))}
                                {editData.family.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFamilyMember(i)}
                                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        ))}


                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {slipsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-16 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">
                            Salary Slips for {selectedEmployeeName}
                        </h2>
                        {salarySlips.length > 0 ? (
                            <ul className="space-y-3">
                                {salarySlips.map((slip) => (
                                    <li
                                        key={slip._id}
                                        className="flex justify-between items-center bg-blue-50 p-3 rounded-md border"
                                    >
                                        <span className="font-medium text-gray-800">{slip.month} {slip.year}</span>
                                        <a
                                            href={`http://localhost:3036/uploads/${slip.filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View Salary Slip
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No salary slips available.</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setSlipsModalOpen(false)}
                                className="text-gray-500 hover:underline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative text-center">
                        <h2 className="text-xl font-semibold text-red-700 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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