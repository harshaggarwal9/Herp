import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import { Toaster } from 'react-hot-toast';

// Admin dashboard components
import AdminDashboard from './components/Admin/AdminDashboard';
import Overview from './components/Admin/Overview';
import UserApproval from './components/Admin/UserApproval';
// import TeacherAssignment from './components/Admin/TeacherAssignment';
// import FeeManagement from './components/Admin/FeeManagement';
// import Notifications from './components/Admin/Notifications';

const App = () => {
  return (
    <div className="bg-[#102E50] h-screen">
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* Admin Dashboard with Nested Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="user-approval" element={<UserApproval />} />
            {/* <Route path="teacher-assignment" element={<TeacherAssignment />} />
            <Route path="fee-management" element={<FeeManagement />} />
            <Route path="notifications" element={<Notifications />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
// import React from 'react'
// import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import LoginPage from './components/LoginPage'
// import SignUp from './components/SignUp'
// import { Toaster } from 'react-hot-toast'
// const App = () => {
//   return (
//     <div className="bg-[#102E50] h-screen">
//       <Toaster/>
//       <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/signUp" element={<SignUp/>} />
//       </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }
// export default App;