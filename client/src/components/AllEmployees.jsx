import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:3036/api/auth/employees');
        setEmployees(res.data.employees);
      } catch (err) {
        console.error('Error fetching employees', err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-[#002855]">👥 All Employees</h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-[#e0efff] text-[#001845] uppercase text-xs font-semibold">
              <th className="px-6 py-4">🧑 Name</th>
              <th className="px-6 py-4">📧 Email</th>
              <th className="px-6 py-4">📅 Date of Joining</th>
              <th className="px-6 py-4">💸 Salary (₹)</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t hover:bg-[#f0f8ff] transition duration-150">
                <td className="px-6 py-4 font-medium text-gray-800">{emp.name}</td>
                <td className="px-6 py-4 text-gray-700">{emp.email}</td>
                <td className="px-6 py-4 text-gray-600">{emp.dateOfJoining?.slice(0, 10) || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-700">{emp.salary || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployees;
