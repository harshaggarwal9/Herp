import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Hourglass,
  BookOpen,
  Banknote,
  Bell,
} from "lucide-react";

const OverviewCard = ({ title, value, Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 border">
    <div className={`p-3 rounded-full ${color} text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalClasses: 0,
    totalFees: 0,
    totalNotifications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, pendingRes, classRes, feeRes, notificationRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/admin/pending-users"),
          axios.get("/api/classes"),
          axios.get("/api/fees"),
          axios.get("/api/notifications"),
        ]);

        const totalFeesCollected = feeRes.data.reduce((sum, fee) => {
          return fee.status === "Paid" ? sum + fee.amount : sum;
        }, 0);

        setStats({
          totalUsers: userRes.data.length,
          pendingUsers: pendingRes.data.length,
          totalClasses: classRes.data.length,
          totalFees: totalFeesCollected,
          totalNotifications: notificationRes.data.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <OverviewCard title="Total Users" value={stats.totalUsers} Icon={Users} color="bg-blue-500" />
      <OverviewCard title="Pending Approvals" value={stats.pendingUsers} Icon={Hourglass} color="bg-yellow-500" />
      <OverviewCard title="Total Classes" value={stats.totalClasses} Icon={BookOpen} color="bg-green-500" />
      <OverviewCard title="Fees Collected" value={`₹${stats.totalFees}`} Icon={Banknote} color="bg-emerald-600" />
      <OverviewCard title="Notifications" value={stats.totalNotifications} Icon={Bell} color="bg-purple-600" />
    </div>
  );
};

export default Overview;
