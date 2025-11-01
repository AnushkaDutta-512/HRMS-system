
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(''); 
    const user = JSON.parse(localStorage.getItem('user')); 

    useEffect(() => {
        setError('');

        if (!user || user.role !== 'admin') {
            setError('⛔ Access denied. Only administrators can view this page.');
            return; 
        }

        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in again.');
                    return;
                }
    const res = await axios.get('http://localhost:3036/api/auth/employees', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(res.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.response?.data?.message || '❌ Error fetching employee data.');
            }
        };

        fetchEmployees();
    }, [user]); 
    if (error && error.includes('Access denied')) {
        return (
            <p className="text-red-600 text-center mt-6 text-lg">
                {error}
            </p>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-[#002855]">👥 All Employees</h2>

            {error && !error.includes('Access denied') && (
                <p className="text-red-600 text-center font-medium mb-4">{error}</p>
            )}

            {employees.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">No employees found.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="bg-[#e0efff] text-[#001845] uppercase text-xs font-semibold">
                                <th className="px-6 py-4"> Employee ID</th> 
                                <th className="px-6 py-4"> Name</th>
                                <th className="px-6 py-4"> Email</th>
                                <th className="px-6 py-4"> Date of Joining</th>
                                <th className="px-6 py-4"> Salary (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id} className="border-t hover:bg-[#f0f8ff] transition duration-150">
                                    <td className="px-6 py-4 font-medium text-gray-800">{emp.employeeId || 'N/A'}</td> {/* Display Employee ID */}
                                    <td className="px-6 py-4 font-medium text-gray-800">{emp.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{emp.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(emp.dateOfJoining).toLocaleDateString() || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-700">{emp.salary || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllEmployees;