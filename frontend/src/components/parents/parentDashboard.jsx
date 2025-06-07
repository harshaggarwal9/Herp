import { useState } from "react";
import axios from "axios";
import {
  User,
  CreditCard,
  FileText,
  Bell,
  LogOutIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./profile";
import FeePayment from "./Fees";
import GetNotifications2 from "../getNotification2";
import { toast } from "react-hot-toast";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "fees", label: "Fee Payment", icon: <CreditCard size={18} /> },
    { id: "results", label: "Show Result", icon: <FileText size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "log-out", label: "Log-out", icon: <LogOutIcon size={18} /> },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    axios.post('/api/auth/logout', {}, { withCredentials: true });
    toast.success("Logged out successfully");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "fees":
        return <FeePayment />;
      case "results":
        return (
          <h1 className="text-3xl font-semibold text-gray-700">
            Results Section
          </h1>
        );
      case "notifications":
        return (
          <h1 className="text-3xl font-semibold text-gray-700">
            <GetNotifications2 />
          </h1>
        );
      case "log-out":
        window.logout_modal.showModal();
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-600 to-blue-500 shadow-lg flex flex-col text-white">
        <div className="p-6 border-b border-blue-300">
          <h2 className="text-2xl font-bold">Parent Dashboard</h2>
        </div>
        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg mb-3 transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "hover:bg-green-500 text-white"
                }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-green-50 p-8 overflow-auto">
        {renderContent()}
      </main>

      {/* Logout Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box bg-gradient-to-br from-green-700 via-blue-800 to-blue-600 text-white shadow-2xl border border-blue-500">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn bg-gray-700 hover:bg-gray-600 text-white border-none">
                Cancel
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
