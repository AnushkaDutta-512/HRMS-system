import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileCard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profilePic, setProfilePic] = useState('');
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`https://hrms-system-9nvh.onrender.com/api/auth/employee/${user.id}`)
        .then((res) => {
          setProfilePic(res.data.profilePic);
          setUserData(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch profile', err);
        });
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      await axios.post(`https://hrms-system-9nvh.onrender.com/api/profile/upload/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Profile picture uploaded!');
      setProfilePic(`profile-pics/${file.name}`);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('❌ Upload failed');
    }
  };

  if (!user) return <p className="text-center mt-10 text-red-600 font-semibold">⚠️ Please log in.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-2xl border border-blue-100">
      <div className="text-center">
        <label htmlFor="upload" className="cursor-pointer block">
          {profilePic ? (
            <img
              src={`http://localhost:3036/uploads/${profilePic}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#0466c8] shadow-md hover:scale-105 transition duration-300 mx-auto"
              title="Click to update"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-3xl bg-gray-100 hover:bg-blue-100 mx-auto">
              ➕
            </div>
          )}
        </label>
        <input type="file" id="upload" className="hidden" onChange={handleUpload} />

        <h2 className="mt-4 text-2xl font-bold text-[#023e7d]">{userData.name}</h2>
      </div>

      <div className="mt-6 space-y-3 text-gray-700 text-sm">
        <p><strong>ID:</strong> {userData._id || userData.id}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Date of Joining:</strong> {new Date(userData.dateOfJoining).toLocaleDateString()}</p>
        <p><strong>Salary:</strong> ₹{userData.salary}</p>
        <p><strong>Education:</strong> {userData.education || 'N/A'}</p>
        <p><strong>Address:</strong> {userData.address || 'N/A'}</p>
        <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
        <p><strong>Emergency Contact:</strong> {userData.emergencyContact || 'N/A'}</p>
        <p><strong>ID Proof (Aadhar / PAN):</strong> {userData.idNumber || 'N/A'}</p>
      </div>

      {userData.family?.length > 0 && (
        <div className="mt-10 bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h3 className="text-lg font-semibold text-[#023e7d] mb-3">👨‍👩‍👧 Family Details</h3>
          {userData.family.map((member, idx) => (
            <div key={idx} className="mb-2 p-2 bg-white rounded shadow-sm text-sm text-gray-700">
              <p><strong>Name:</strong> {member.name}</p>
              <p><strong>Relation:</strong> {member.relation}</p>
              <p><strong>Contact:</strong> {member.contact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
