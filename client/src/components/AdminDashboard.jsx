import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // selected employee
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:3036/api/employees/all');
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://localhost:3036/api/employees/delete/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert('❌ Failed to delete employee');
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
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3036/api/employees/update/${editing._id}`, editData);
      alert('✅ Employee updated');
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert('❌ Update failed');
    }
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...editData.family];
    updated[index][field] = value;
    setEditData({ ...editData, family: updated });
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-red-600 text-center mt-4">⛔ Access Denied: HR/Admins Only</p>;
  }

  if (loading) return <p className="text-center mt-4 text-gray-600">Loading employees...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">HR Dashboard – All Employees</h1>

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
                <td className="px-6 py-3 space-x-2">
                  <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-16 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl relative">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Edit Employee</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'salary', 'phone', 'address', 'education'].map((field) => (
                <div key={field}>
                  <label className="text-sm font-semibold capitalize text-gray-700">{field}</label>
                  <input
                    type={field === 'salary' ? 'number' : 'text'}
                    value={editData[field] || ''}
                    onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            <h3 className="mt-6 text-lg font-semibold text-blue-700">Family Members</h3>
            {editData.family.map((f, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 mb-2">
                {['name', 'relation', 'contact'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={f[field] || ''}
                    onChange={(e) => handleFamilyChange(i, field, e.target.value)}
                    placeholder={field}
                    className="px-3 py-2 border rounded-md"
                  />
                ))}
              </div>
            ))}

            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:underline">Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
