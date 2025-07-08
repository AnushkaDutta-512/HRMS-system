import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminCreateEmployee from './components/AdminCreateEmployee';
import UploadSlip from './components/UploadSlip';
import SlipList from './components/SlipList';
import ApplyLeave from './components/ApplyLeave';
import LeaveRequests from './components/LeaveRequests';
import MarkAttendance from './components/MarkAttendance';
import AttendanceRecords from './components/AttendanceRecords';
import LeaveStatus from './components/LeaveStatus';
import ProfileCard from './components/ProfileCard';
import AllEmployees from './components/AllEmployees';
import PrivateRoute from './components/PrivateRoute';
import Welcome from './components/Welcome';
import AdminDashboard from './components/AdminDashboard';
import EmployeeAllowanceForm from './components/EmployeeAllowanceForm';
import AdminAllowancePanel from './components/AdminAllowancePanel';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/welcome"
          element={
            <PrivateRoute roles={['admin', 'employee']}>
              <Welcome />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute roles={['admin']}>
              <UploadSlip />
            </PrivateRoute>
          }
        />
        <Route
          path="/leave-requests"
          element={
            <PrivateRoute roles={['admin']}>
              <LeaveRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance-records"
          element={
            <PrivateRoute roles={['admin']}>
              <AttendanceRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-employees"
          element={
            <PrivateRoute roles={['admin']}>
              <AllEmployees />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-allowance"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminAllowancePanel />
            </PrivateRoute>
          }
        />


        <Route
          path="/create-employee"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminCreateEmployee />
            </PrivateRoute>
          }
        />

       
        <Route
          path="/apply-leave"
          element={
            <PrivateRoute roles={['employee']}>
              <ApplyLeave />
            </PrivateRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <PrivateRoute roles={['employee']}>
              <MarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-leaves"
          element={
            <PrivateRoute roles={['employee']}>
              <LeaveStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/apply-allowance"
          element={
            <PrivateRoute roles={['employee']}>
              <EmployeeAllowanceForm />
            </PrivateRoute>
          }
        />

       
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={['employee', 'admin']}>
              <ProfileCard />
            </PrivateRoute>
          }
        />
        <Route
          path="/slips"
          element={
            <PrivateRoute roles={['employee', 'admin']}>
              <SlipList />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
