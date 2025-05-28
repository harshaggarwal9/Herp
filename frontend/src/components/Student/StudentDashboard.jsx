import { useState } from "react";
import {
  User,
  CalendarClock,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";
import ProfileSection from "./Profile";
import GetNotifications from "../getNotifcations";

export default function StudentDashboard() {
  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "timetable", label: "Time Table", icon: <CalendarClock size={18} /> },
    { id: "results", label: "Show Result", icon: <FileText size={18} /> },
    { id: "fees", label: "Fee Payment", icon: <CreditCard size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection/>;
      case "timetable":
        return <h1 className="text-3xl font-semibold text-gray-700">Time Table Section</h1>;
      case "results":
        return <h1 className="text-3xl font-semibold text-gray-700">Results Section</h1>;
      case "fees":
        return <h1 className="text-3xl font-semibold text-gray-700">Fee Payment Section</h1>;
      case "notifications":
        return <h1 className="text-3xl font-semibold text-gray-700"><GetNotifications/></h1>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-pink-500 shadow-lg flex flex-col text-white">
        <div className="p-6 border-b border-pink-300">
          <h2 className="text-2xl font-bold">Student Dashboard</h2>
        </div>
        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg mb-3 transition-colors
                ${activeTab === tab.id 
                  ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
                  : "hover:bg-purple-500 text-white"}`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
