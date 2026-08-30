import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AllEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(''); 
    const user = JSON.parse(localStorage.getItem('user')); 

    useEffect(() => {
        setError('');

        if (!user || user.role !== 'admin') {
            setError('Access Denied: Only administrators can view this page.');
            return; 
        }

        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in again.');
                    return;
                }
                const res = await axios.get(`${API_BASE_URL}/api/auth/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(res.data || []);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.response?.data?.message || 'Error fetching employee data.');
            }
        };

        fetchEmployees();
    }, [user]);

    if (error && error.includes('Access Denied')) {
        return (
            <div className="max-w-md mx-auto mt-16 glass-panel p-8 rounded-3xl text-center">
                <span className="material-symbols-rounded text-4xl text-red-400 mb-2">lock</span>
                <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
                <p className="text-base text-gray-300">{error}</p>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            {/* Standard Uniform Module Header */}
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
                    <span className="material-symbols-rounded text-brand-light text-4xl">groups</span>
                    Employee Directory
                </h2>
                <p className="text-base text-gray-300 mt-2 font-sans">Directory and record management for all registered personnel</p>
            </div>

            {error && !error.includes('Access Denied') && (
                <div className="mb-6 p-4.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-base font-semibold flex items-center gap-3">
                    <span className="material-symbols-rounded text-2xl">error</span>
                    <span>{error}</span>
                </div>
            )}

            {employees.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-3xl">
                    <p className="text-gray-300 text-lg">No employees found in directory.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden border border-dark-600/80 shadow-2xl bg-dark-900/85">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-base text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/95 text-gray-200 text-sm font-bold uppercase tracking-wider border-b border-dark-600/80">
                                    <th className="px-6 py-5 font-bold">Employee ID</th> 
                                    <th className="px-6 py-5 font-bold">Name</th>
                                    <th className="px-6 py-5 font-bold">Email Address</th>
                                    <th className="px-6 py-5 font-bold">Date of Joining</th>
                                    <th className="px-6 py-5 font-bold">Base Salary</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-600/50">
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-5 font-mono font-bold text-brand-light text-sm">{emp.employeeId || emp._id}</td>
                                        <td className="px-6 py-5 font-bold text-white text-base">{emp.name}</td>
                                        <td className="px-6 py-5 text-gray-200 font-mono text-sm">{emp.email}</td>
                                        <td className="px-6 py-5 text-gray-300 font-mono text-sm">{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-5 text-emerald-400 font-mono font-extrabold text-lg">
                                            {emp.salary ? `₹${Number(emp.salary).toLocaleString('en-IN')}` : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllEmployees;