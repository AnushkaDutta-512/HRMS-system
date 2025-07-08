import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  // Fetch profilePic if not present
  useEffect(() => {
    if (user?.id && !user.profilePic) {
      axios
        .get(`http://localhost:3036/api/auth/employee/${user.id}`)
        .then((res) => {
          const updatedUser = { ...user, profilePic: res.data.profilePic };
          login(updatedUser);
        })
        .catch((err) => console.error('❌ Failed to fetch user pic:', err));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 border-b border-blue-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Left Section */}
        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-[#0466c8] font-semibold hover:text-[#023e7d] transition"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center flex-wrap gap-4">
            {/* Profile Info */}
            <div className="flex items-center gap-3 text-[#001845] font-medium">
              {user.profilePic && (
                <img
                  src={`http://localhost:3036/uploads/${user.profilePic}`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#0466c8]"
                />
              )}
              <span className="text-lg">{user.name}</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/welcome"
                className="text-[#0466c8] font-semibold hover:text-[#023e7d] transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
