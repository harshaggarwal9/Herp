import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, Clock, FileText, CheckSquare, Bell } from "lucide-react";

const tabs = [
  { label: "Profile", path: "profile", icon: <User className="inline mr-1" /> },
  { label: "Time Table", path: "Show-Timetable", icon: <Clock className="inline mr-1" /> },
  { label: "Create Exam", path: "create-exam", icon: <FileText className="inline mr-1" /> },
  { label: "Create Result", path: "create-result", icon: <CheckSquare className="inline mr-1" /> },
  { label: "Notifications", path: "notifications", icon: <Bell className="inline mr-1" /> },
];

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="flex gap-4 border-b border-slate-400 mb-6">
        {tabs.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium flex items-center transition-all duration-200 ${
                isActive
                  ? "border-b-2 border-blue-400 text-blue-300"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
