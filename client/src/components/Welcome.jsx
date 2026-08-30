import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const adminTiles = [
    { label: 'Leave Requests', icon: 'description', sub: 'Review employee leave applications', route: '/leave-requests', color: 'from-blue-500 to-cyan-500' },
    { label: 'Attendance Records', icon: 'calendar_month', sub: 'View and audit attendance logs', route: '/attendance-records', color: 'from-purple-500 to-pink-500' },
    { label: 'All Employees', icon: 'groups', sub: 'Directory of registered workforce', route: '/all-employees', color: 'from-amber-500 to-rose-500' },
    { label: 'Manage Allowances', icon: 'account_balance_wallet', sub: 'Approve & audit financial allowances', route: '/admin-allowance', color: 'from-emerald-500 to-teal-500' },
    { label: 'Create Employee', icon: 'person_add', sub: 'Onboard new personnel to system', route: '/create-employee', color: 'from-indigo-500 to-blue-500' },
    { label: 'HR Dashboard', icon: 'dashboard', sub: 'Core administrative control center', route: '/admin-dashboard', color: 'from-violet-500 to-purple-500' },
    { label: 'My Profile', icon: 'person', sub: 'View & update personal credentials', route: '/profile', color: 'from-slate-500 to-gray-500' }
  ];

  const employeeTiles = [
    { label: 'Apply Leave', icon: 'edit_calendar', sub: 'Submit time-off requests', route: '/apply-leave', color: 'from-blue-500 to-cyan-500' },
    { label: 'Mark Attendance', icon: 'fact_check', sub: 'Log daily check-in & check-out', route: '/mark-attendance', color: 'from-purple-500 to-pink-500' },
    { label: 'My Leaves', icon: 'history', sub: 'Track submitted leave status', route: '/my-leaves', color: 'from-amber-500 to-rose-500' },
    { label: 'My Profile', icon: 'person', sub: 'View & manage your profile', route: '/profile', color: 'from-slate-500 to-gray-500' },
    { label: 'Apply Allowance', icon: 'credit_card', sub: 'Request extra expense reimbursement', route: '/apply-allowance', color: 'from-emerald-500 to-teal-500' }
  ];

  const tiles = user?.role === 'admin' ? adminTiles : (user?.role === 'employee' ? employeeTiles : []);

  tiles.push({
    label: 'Salary Slips',
    icon: 'receipt_long',
    sub: 'Access & download monthly payslips',
    route: '/slips',
    color: 'from-yellow-500 to-amber-500'
  });

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">
            Welcome to <span className="text-brand-light font-extrabold drop-shadow-[0_0_25px_rgba(96,165,250,0.7)]">HRMS</span> Portal
          </h1>
          <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Select a module below to execute HR operations with enterprise precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-DEFAULT/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          {tiles.map((tile, idx) => (
            <div
              key={idx}
              onClick={() => navigate(tile.route)}
              className="group cursor-pointer flex flex-col p-7 rounded-3xl overflow-hidden relative border border-dark-600/80 bg-dark-900/85 backdrop-blur-2xl shadow-xl transition-all duration-300 ease-out transform hover:scale-[1.04] hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(59,130,246,0.35)] hover:border-brand-DEFAULT/70 hover:bg-dark-800/95"
            >
              {/* Radial Hover Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-DEFAULT/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Top Right Ambient Icon Highlight */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-DEFAULT/10 rounded-full blur-xl group-hover:bg-brand-DEFAULT/30 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${tile.color} text-white shadow-xl mb-5 transform group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300 ease-out`}>
                  <span className="material-symbols-rounded text-3xl">{tile.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-brand-light transition-colors tracking-tight">
                  {tile.label}
                </h3>
                <p className="text-base text-gray-300 font-sans leading-relaxed">
                  {tile.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
