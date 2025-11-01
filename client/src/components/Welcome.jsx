import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const tiles = [];

  if (user?.role === 'admin') {
    tiles.push(
      { label: 'Leave Requests', icon: '📥', sub: 'Review employee leave requests', route: '/leave-requests' },
      { label: 'Attendance Records', icon: '🗓️', sub: 'View and manage attendance logs', route: '/attendance-records' },
      { label: 'All Employees', icon: '👥', sub: 'View all registered employees', route: '/all-employees' },
      { label: 'Manage Allowance', icon: '🧾', sub: 'Handle allowance requests', route: '/admin-allowance' },
      { label: 'Create Employee', icon: '➕', sub: 'Add new employee to the system', route: '/create-employee' },
      { label: 'HR Dashboard', icon: '📊', sub: 'Overview of HR operations', route: '/admin-dashboard' },
      { label: 'My Profile', icon: '🙍', sub: 'View or update your profile', route: '/profile' }
    );
  } else if (user?.role === 'employee') {
    tiles.push(
      { label: 'Apply Leave', icon: '📝', sub: 'Submit your leave application', route: '/apply-leave' },
      { label: 'Mark Attendance', icon: '📍', sub: 'Record your daily attendance', route: '/mark-attendance' },
      { label: 'My Leaves', icon: '📆', sub: 'View your leave history', route: '/my-leaves' },
      { label: 'My Profile', icon: '🙍', sub: 'View or update your profile', route: '/profile' },
      { label: 'Apply Allowance', icon: '💵', sub: 'Request extra financial allowance', route: '/apply-allowance' }
    );
  }

  tiles.push({
    label: 'View  Salary Slips',
    icon: '💰',
    sub: 'Access your salary slips',
    route: '/slips'
  });

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-12 drop-shadow">
        Welcome to HRMS System
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            onClick={() => navigate(tile.route)}
            className="cursor-pointer bg-white border border-blue-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:bg-blue-100/30 transition duration-300 ease-in-out flex flex-col items-center text-center"
          >
            <div className="text-4xl mb-2">{tile.icon}</div>
            <div className="text-lg font-semibold text-blue-900">{tile.label}</div>
            <div className="text-sm text-gray-600 mt-1">{tile.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
