import { useState } from "react";
import {
  User,
  CreditCard,
  FileText,
  Bell,
} from "lucide-react";
import ProfileSection from "./profile";
import FeePayment from "./Fees";
import GetNotifications from "../getNotifcations";

export default function ParentDashboard() {
  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "fees", label: "Fee Payment", icon: <CreditCard size={18} /> },
    { id: "results", label: "Show Result", icon: <FileText size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "fees":
        return (
         <FeePayment/>
        );
      case "results":
        return (
          <h1 className="text-3xl font-semibold text-gray-700">
            Results Section
          </h1>
        );
      case "notifications":
        return (
          <h1 className="text-3xl font-semibold text-gray-700">
            <GetNotifications/>
          </h1>
        );
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
                ${activeTab === tab.id
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "hover:bg-green-500 text-white"}`}
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
    </div>
  );
}
