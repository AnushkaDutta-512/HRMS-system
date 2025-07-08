import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfJoining: '',
    salary: '',
    role: 'employee',
    education: '',
    address: '',
    phone: '',
    emergencyContact: '',
    idNumber: ''
  });

  const [family, setFamily] = useState([{ name: '', relation: '', contact: '' }]);
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFamilyChange = (index, e) => {
    const updatedFamily = [...family];
    updatedFamily[index][e.target.name] = e.target.value;
    setFamily(updatedFamily);
  };

  const addFamilyMember = () => {
    setFamily([...family, { name: '', relation: '', contact: '' }]);
  };

  const removeFamilyMember = (index) => {
    const updatedFamily = [...family];
    updatedFamily.splice(index, 1);
    setFamily(updatedFamily);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3036/api/auth/create-employee',
        { ...formData, family },
        {
          headers: { Authorization: token }
        }
      );
      setCredentials(res.data.credentials);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create employee');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-gradient-to-br from-[#f0f8ff] to-white rounded-3xl shadow-xl border border-[#d0e4ff]">
      <h2 className="text-4xl font-extrabold text-center text-[#002855] mb-10">👤 Create New Employee</h2>

      {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'name', placeholder: 'Full Name', type: 'text' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'dateOfJoining', placeholder: 'Date of Joining', type: 'date' },
          { name: 'salary', placeholder: 'Salary', type: 'number' },
          { name: 'education', placeholder: 'Education Qualifications', type: 'text' },
          { name: 'address', placeholder: 'Address', type: 'text' },
          { name: 'phone', placeholder: 'Phone Number', type: 'text' },
          { name: 'emergencyContact', placeholder: 'Emergency Contact', type: 'text' },
          { name: 'idNumber', placeholder: 'Aadhar / PAN (optional)', type: 'text' }
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">{field.placeholder}</label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              required={field.name !== 'idNumber'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
            />
          </div>
        ))}

        <div className="md:col-span-2 mt-8">
          <h3 className="text-2xl font-semibold text-[#0353a4] mb-4">👨‍👩‍👧 Family Details</h3>
          {family.map((member, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-300 shadow-sm relative"
            >
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={member.name}
                  onChange={(e) => handleFamilyChange(index, e)}
                  placeholder="e.g. ABC XYZ"
                  className="w-full px-3 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Relation</label>
                <input
                  type="text"
                  name="relation"
                  value={member.relation}
                  onChange={(e) => handleFamilyChange(index, e)}
                  placeholder="e.g. Sister"
                  className="w-full px-3 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold mb-1">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={member.contact}
                  onChange={(e) => handleFamilyChange(index, e)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#0466c8]"
                  required
                />
                {family.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 text-sm"
                  >
                    ✖
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFamilyMember}
            className="text-sm text-[#0466c8] hover:underline mt-2"
          >
            + Add Another Family Member
          </button>
        </div>

        <button
          type="submit"
          className="md:col-span-2 mt-10 bg-[#0466c8] hover:bg-[#0353a4] text-white font-bold py-3 rounded-xl shadow-lg transition"
        >
          Create Employee
        </button>
      </form>

      {credentials && (
        <div className="mt-10 p-6 bg-[#d2f4e6] border border-green-400 rounded-xl shadow text-green-900">
          <h3 className="text-xl font-semibold mb-2">✅ Credentials Generated</h3>
          <p><strong>Email:</strong> {credentials.email}</p>
          <p><strong>Password:</strong> {credentials.password}</p>
          <p><strong>Employee ID:</strong> {credentials.employeeId}</p>
        </div>
      )}
    </div>
  );
};

export default AdminCreateEmployee;
