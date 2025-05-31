// AdminDashboard.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "User Approval", path: "user-approval" },
  { label: "Teacher Assignment", path: "teacher-assignment" },
  { label: "Fee Management", path: "fee-management" },
  { label: "Create Notifications", path: "notifications" },
  { label: "Add Subject",path:"add-subject"},
  { label: "Add Class",path:"add-class"},
  { label: "Create Slot",path:"create-timetable"},
];

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex gap-4 border-b mb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium ${
                isActive ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet /> {/* Render the active tab content here */}
    </div>
  );
};

export default AdminDashboard;
