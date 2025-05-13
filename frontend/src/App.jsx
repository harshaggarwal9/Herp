import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/protectedRoute.jsx';
// Admin dashboard components
import AdminDashboard from './components/Admin/AdminDashboard';
import Overview from './components/Admin/Overview';
import UserApproval from './components/Admin/UserApproval';
import useAuthStore from './stores/useAuthStore.js';
// import TeacherAssignment from './components/Admin/TeacherAssignment';
// import FeeManagement from './components/Admin/FeeManagement';
// import Notifications from './components/Admin/Notifications';

const App = () => {
  const {user} = useAuthStore();
  return (
    <div className="bg-[#102E50] h-screen">
      <Toaster />
      <BrowserRouter>
       <Routes> 
        
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="user-approval" element={<UserApproval />} />
            </Route>
         </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
