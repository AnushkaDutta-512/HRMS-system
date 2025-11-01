import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
const Navbar = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.id && !user.profilePic) {
      axios
        .get(`https://hrms-system-9nvh.onrender.com/api/auth/employee/${user.id}`)
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
            
            <div className="flex items-center gap-3 text-[#001845] font-medium">
              {user.profilePic && (
                <img
                  src={`https://hrms-system-9nvh.onrender.com/uploads/${user.profilePic}`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#0466c8]"
                />
              )}
              <span className="text-lg">{user.name}</span>
            </div>

           
            <div className="flex items-center gap-6 relative">
              <Link
                to="/welcome"
                className="text-[#0466c8] font-semibold hover:text-[#023e7d] transition"
              >
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-red-600 font-semibold hover:text-red-700 transition"
                >
                  Options ▾
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-20"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/change-password');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
