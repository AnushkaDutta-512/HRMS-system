import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../apiConfig';
import WaveBackground from './WaveBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // 'employee' or 'admin'
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      if (token && user) {
        login(user, token);
        navigate('/welcome');
      } else {
        setMsg('Login failed: Invalid server response');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative py-10 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Animated Wave Background in Blue Palette */}
      <WaveBackground backdropBlurAmount="lg" />

      {/* Main 2-Column Split Card */}
      <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2.5rem] shadow-2xl border border-dark-600/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-dark-900/80 backdrop-blur-2xl">
        
        {/* Left Column: Form & Login Controls */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between relative z-10 bg-dark-800/40">
          <div>
            {/* HRMS Logo Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                HRMS<span className="text-brand-light font-bold drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]">.sys</span>
              </h1>
            </div>

            {/* Profile Avatar Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600/30 to-indigo-500/20 border-2 border-brand-DEFAULT/40 flex items-center justify-center text-brand-light shadow-xl shadow-blue-500/10">
                <span className="material-symbols-rounded text-4xl">person</span>
              </div>
            </div>

            {/* Sign In & Role Toggle Selector */}
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Sign In</h2>
              <div className="flex items-center gap-2 text-xs font-semibold bg-dark-900/80 p-1.5 rounded-full border border-dark-600/80">
                <span className="text-gray-400 pl-2">Login As:</span>
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={`px-3 py-1 rounded-full transition-all duration-300 ${
                    role === 'employee'
                      ? 'bg-brand-DEFAULT text-white shadow-md shadow-brand-DEFAULT/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 rounded-full transition-all duration-300 ${
                    role === 'admin'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input Field with Pill Rounded Design */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-DEFAULT to-blue-600 flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-rounded text-base">mail</span>
                  </div>
                </div>
                <input
                  type="email"
                  placeholder="Email address or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-3.5 rounded-full bg-dark-900/80 text-white placeholder-gray-500 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT transition-all duration-300 text-sm shadow-inner"
                  required
                />
              </div>

              {/* Password Input Field with Pill Rounded Design */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-rounded text-base">lock</span>
                  </div>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-3.5 rounded-full bg-dark-900/80 text-white placeholder-gray-500 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT transition-all duration-300 text-sm shadow-inner"
                  required
                />
              </div>

              {/* Glowing Blue Pill Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 via-brand-DEFAULT to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-rounded text-xl">arrow_forward</span>
                  </>
                )}
              </button>

              {msg && (
                <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium backdrop-blur-sm flex items-center justify-center gap-2">
                  <span className="material-symbols-rounded text-base">error</span>
                  <span>{msg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Bottom Button: Forgot Password */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-dark-600 bg-dark-900/60 text-xs font-semibold text-gray-300 hover:text-white hover:border-brand-DEFAULT/50 hover:bg-dark-700 transition-all duration-300"
            >
              <span className="material-symbols-rounded text-base text-brand-light">help_outline</span>
              Forgot Password ?
            </button>
          </div>
        </div>

        {/* Right Column: High-Tech Blue HR Illustration & Highlights Banner */}
        <div className="lg:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-blue-950/60 via-dark-800/80 to-indigo-950/60 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-dark-600/60">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-brand-light text-xs font-semibold mb-4">
              <span className="material-symbols-rounded text-base">verified</span>
              Next-Gen Workforce Portal
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-3">
              Streamline HR & Payroll Operations with Precision
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
              Access real-time attendance analytics, automated salary slip generation, allowance tracking, and employee management.
            </p>
          </div>

          {/* Center Graphic Image */}
          <div className="relative z-10 my-4 flex justify-center items-center">
            <div className="relative p-3 rounded-3xl bg-dark-900/40 border border-dark-600/50 shadow-2xl backdrop-blur-xl group hover:border-brand-DEFAULT/40 transition-all duration-500">
              <img
                src="/hr_illustration.png"
                alt="HR Management System"
                className="w-full max-h-[260px] object-contain rounded-2xl drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Feature Micro-Badges */}
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-4">
            <div className="glass-panel p-3 rounded-2xl text-center border-dark-600/50">
              <span className="material-symbols-rounded text-brand-light text-xl mb-1">receipt_long</span>
              <div className="text-[11px] font-semibold text-white">Instant Payslips</div>
              <div className="text-[9px] text-gray-400">PDF & Excel</div>
            </div>
            <div className="glass-panel p-3 rounded-2xl text-center border-dark-600/50">
              <span className="material-symbols-rounded text-emerald-400 text-xl mb-1">fact_check</span>
              <div className="text-[11px] font-semibold text-white">Attendance</div>
              <div className="text-[9px] text-gray-400">Live Check-in</div>
            </div>
            <div className="glass-panel p-3 rounded-2xl text-center border-dark-600/50">
              <span className="material-symbols-rounded text-purple-400 text-xl mb-1">shield</span>
              <div className="text-[11px] font-semibold text-white">Secure RBAC</div>
              <div className="text-[9px] text-gray-400">Encrypted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Forgot Password Assistance */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="glass-panel bg-dark-800/95 rounded-3xl p-6 sm:p-8 w-full max-w-md relative border border-dark-600/80 shadow-2xl text-center">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-rounded text-2xl">close</span>
            </button>
            <div className="w-14 h-14 rounded-2xl bg-brand-DEFAULT/20 text-brand-light border border-brand-DEFAULT/30 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-rounded text-3xl">key</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Password Reset Assistance</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              For security compliance, please contact your company's HR Administrator to request a password reset or temporary credential issuance.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full btn-primary py-2.5 text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
