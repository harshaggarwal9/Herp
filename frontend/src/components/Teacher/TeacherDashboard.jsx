// src/components/Teacher/TeacherDashboard.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, Clock, FileText, CheckSquare, Bell } from "lucide-react";

const tabs = [
  { label: "Profile", path: "profile", icon: <User className="inline mr-1" /> },
  { label: "Time Table", path: "timetable", icon: <Clock className="inline mr-1" /> },
  { label: "Create Exam", path: "create-exam", icon: <FileText className="inline mr-1" /> },
  { label: "Create Result", path: "create-result", icon: <CheckSquare className="inline mr-1" /> },
  { label: "Notifications", path: "notifications", icon: <Bell className="inline mr-1" /> },
];

export default function TeacherDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="flex gap-4 border-b mb-4">
        {tabs.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium flex items-center ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>

      {/* Renders the component for the active tab, based on your <Route> definitions */}
      <Outlet />
    </div>
  );
}
