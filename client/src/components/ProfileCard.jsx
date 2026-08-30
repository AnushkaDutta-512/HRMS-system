import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const ProfileCard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [userData, setUserData] = useState(user || {});
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      axios
        .get(`${API_BASE_URL}/api/auth/employee/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setProfilePic(res.data.profilePic || '');
          setUserData(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch profile', err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict client-side image format validation
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop().toLowerCase();
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      setStatusMsg('Invalid file format. Please select a valid image file (.png, .jpg, .jpeg, .webp).');
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    const userId = user?.id || user?._id;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/profile/upload/${userId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        },
      });
      setStatusMsg(res.data?.msg || 'Profile picture updated successfully!');
      setIsSuccess(true);
      if (res.data?.filename) {
        setProfilePic(`profile-pics/${res.data.filename}`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusMsg(err.response?.data?.msg || 'Upload failed. Only image files (.jpg, .png, .webp) are allowed.');
      setIsSuccess(false);
    }
  };

  if (!user) return (
    <div className="flex justify-center mt-20">
      <div className="glass-panel p-8 rounded-3xl flex items-center gap-4 text-red-400">
        <span className="material-symbols-rounded text-3xl">gpp_maybe</span>
        <span className="font-bold text-xl">Please log in to view profile credentials.</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 lg:p-8 relative z-10">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden bg-dark-900/85 border border-dark-600/80">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-DEFAULT/10 rounded-full blur-[100px] pointer-events-none"></div>

        {statusMsg && (
          <div className={`mb-8 p-4.5 rounded-2xl flex items-center gap-3 text-base font-semibold border ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span className="material-symbols-rounded text-2xl">
              {isSuccess ? 'check_circle' : 'error'}
            </span>
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          
          <div className="flex flex-col items-center">
            <label htmlFor="upload" className="cursor-pointer block relative group">
              {profilePic ? (
                <div className="relative">
                  <img
                    src={`${API_BASE_URL}/uploads/${profilePic}`}
                    alt="Profile"
                    className="w-44 h-44 rounded-full object-cover border-4 border-dark-600 shadow-2xl group-hover:border-brand-DEFAULT transition-all duration-300"
                    title="Click to update image"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="material-symbols-rounded text-4xl text-white">photo_camera</span>
                  </div>
                </div>
              ) : (
                <div className="w-44 h-44 rounded-full border-2 border-dashed border-dark-500 bg-dark-800/50 flex flex-col items-center justify-center text-gray-300 hover:bg-dark-700 hover:border-brand-DEFAULT hover:text-brand-light transition-all duration-300">
                  <span className="material-symbols-rounded text-4xl mb-2">photo_camera</span>
                  <span className="text-sm font-bold">Upload</span>
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="upload" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
              onChange={handleUpload} 
            />

            <div className="mt-6 text-center">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">{userData.name}</h2>
              <span className="inline-block mt-2.5 px-4 py-1.5 rounded-full bg-brand-DEFAULT/15 text-brand-light text-sm font-bold border border-brand-DEFAULT/30 capitalize tracking-wide">
                {userData.role}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">badge</span>
                  <h3 className="font-bold text-white text-base">Employee ID</h3>
                </div>
                <p className="text-gray-100 font-mono text-base font-bold">{userData.employeeId || userData._id || userData.id}</p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">mail</span>
                  <h3 className="font-bold text-white text-base">Email Address</h3>
                </div>
                <p className="text-gray-100 font-mono text-base truncate">{userData.email}</p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">calendar_month</span>
                  <h3 className="font-bold text-white text-base">Date of Joining</h3>
                </div>
                <p className="text-gray-200 text-base">{userData.dateOfJoining ? new Date(userData.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">work</span>
                  <h3 className="font-bold text-white text-base">Base Salary</h3>
                </div>
                <p className="text-emerald-400 font-mono font-extrabold text-xl">₹{userData.salary?.toLocaleString('en-IN') || '0'}</p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">school</span>
                  <h3 className="font-bold text-white text-base">Education</h3>
                </div>
                <p className="text-gray-200 text-base">{userData.education || 'N/A'}</p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">phone</span>
                  <h3 className="font-bold text-white text-base">Phone & Emergency</h3>
                </div>
                <p className="text-gray-200 text-base">{userData.phone || 'N/A'}</p>
                <p className="text-gray-300 text-xs sm:text-sm mt-1.5 border-t border-dark-600/60 pt-1.5">Emergency: <span className="font-semibold text-white">{userData.emergencyContact || 'N/A'}</span></p>
              </div>

              <div className="glass-card p-6 !bg-dark-800/50 sm:col-span-2">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">location_on</span>
                  <h3 className="font-bold text-white text-base">Address Details</h3>
                </div>
                <p className="text-gray-200 leading-relaxed text-base">{userData.address || 'N/A'}</p>
              </div>
              
              <div className="glass-card p-6 !bg-dark-800/50 sm:col-span-2">
                <div className="flex items-center gap-3 text-brand-light mb-2">
                  <span className="material-symbols-rounded text-2xl">fingerprint</span>
                  <h3 className="font-bold text-white text-base">ID Proof Number</h3>
                </div>
                <p className="text-gray-100 font-mono tracking-wider text-base font-bold">{userData.idNumber || 'N/A'}</p>
              </div>

            </div>
          </div>
        </div>

        {userData.family?.length > 0 && (
          <div className="mt-12 border-t border-dark-600/60 pt-10 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-brand-DEFAULT/20 rounded-xl">
                <span className="material-symbols-rounded text-3xl text-brand-light">groups</span>
              </div>
              <h3 className="text-2xl font-display font-extrabold text-white">Family Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.family.map((member, idx) => (
                <div key={idx} className="glass-card p-6 border-l-4 border-l-brand-DEFAULT hover:border-l-brand-light">
                  <div className="font-bold text-white text-xl mb-1">{member.name}</div>
                  <div className="text-xs text-brand-light font-bold mb-3 uppercase tracking-wider">{member.relation}</div>
                  <div className="flex items-center gap-2.5 text-gray-300 text-sm font-semibold">
                    <span className="material-symbols-rounded text-lg">phone</span>
                    {member.contact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
