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
import AssignTeacher from './components/Admin/assignteacher.jsx';
import AddSubject from './components/Admin/AddSubject.jsx';
import AddClass from './components/Admin/AddClass.jsx';
import TeacherDashboard from './components/Teacher/TeacherDashboard.jsx';
import Profile from './components/Teacher/Profile.jsx';

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
            <Route path="teacher-assignment" element={<AssignTeacher/>}/>
            <Route path="add-subject" element={<AddSubject/>}/>
            <Route path="add-class" element={<AddClass/>}/>
          </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRole="teacher" />}>
            <Route path="/teacher" element={<TeacherDashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
