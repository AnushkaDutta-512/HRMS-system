import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../apiConfig';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId && !user.profilePic && token) {
      axios
        .get(`${API_BASE_URL}/api/auth/employee/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const updatedUser = { ...user, profilePic: res.data.profilePic };
          login(updatedUser, token);
        })
        .catch((err) => console.error('Failed to fetch user pic:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-dark-600/60 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to={user ? "/welcome" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all">
            H
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            HRMS<span className="text-brand-light font-bold drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]">.sys</span>
          </span>
        </Link>

        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-300 font-medium hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              to="/welcome"
              className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-dark-700/50"
            >
              <span className="material-symbols-rounded text-xl">dashboard</span>
              Dashboard
            </Link>

            <div className="h-8 w-px bg-dark-600/50 hidden sm:block"></div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-dark-700/50 border border-transparent hover:border-dark-600 transition-all"
              >
                {user.profilePic ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${user.profilePic}`}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-DEFAULT shadow-sm shadow-brand-DEFAULT/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-dark-700 border-2 border-dark-600 flex items-center justify-center text-gray-300">
                    <span className="material-symbols-rounded text-xl">person</span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-white leading-tight">{user.name}</div>
                  <div className="text-xs text-brand-light font-medium capitalize">{user.role}</div>
                </div>
                <span className={`material-symbols-rounded text-xl text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 glass-panel bg-dark-800/95 rounded-2xl shadow-2xl z-20 py-2 border border-dark-600 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-dark-600/50 sm:hidden">
                       <div className="text-sm font-semibold text-white">{user.name}</div>
                       <div className="text-xs text-brand-light capitalize">{user.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/change-password');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-dark-700/60 text-sm text-gray-200 hover:text-white flex items-center gap-3 transition-colors"
                    >
                      <span className="material-symbols-rounded text-xl text-gray-400">key</span>
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-500/15 text-sm text-red-400 flex items-center gap-3 transition-colors mt-1"
                    >
                      <span className="material-symbols-rounded text-xl">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
