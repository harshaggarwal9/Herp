import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "User Approval", path: "user-approval" },
  { label: "Teacher Assignment", path: "teacher-assignment" },
  { label: "Fee Management", path: "fee-management" },
  { label: "Create Notifications", path: "notifications" },
  { label: "Add Subject", path: "add-subject" },
  { label: "Add Class", path: "add-class" },
  { label: "Create Slot", path: "create-timetable" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    axios.post("/api/auth/logout", {}, { withCredentials: true });
    toast.success("Logged out successfully");
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        Admin Dashboard
      </h1>

      {/* Tabs: scrollable on mobile */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 border-b mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-all"
        >
          Log-out
        </button>
      </div>

      {/* Page content */}
      <Outlet />

      {/* Logout Modal */}
      {showLogoutModal && (
        <dialog open className="modal">
          <div className="modal-box bg-white text-gray-800 shadow-xl border border-gray-300">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                className="btn bg-gray-200 text-black border-none w-full sm:w-auto"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-600 text-white border-none w-full sm:w-auto"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
