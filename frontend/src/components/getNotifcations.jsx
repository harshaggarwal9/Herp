import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';

// Initialize socket
const socket = io('https://mjerp.onrender.com', { withCredentials: true });

export default function GetNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing notifications
    (async () => {
      try {
        const { data } = await axios.get(
          'https://mjerp.onrender.com/api/notification/get',
          { withCredentials: true }
        );
        setNotifs(data);
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    })();

    // Listen for real-time notifications
    socket.on('notification', (newNotif) => {
      setNotifs((prev) => [newNotif, ...prev]);
      toast.success(`New: ${newNotif.title}`);
    });

    // Cleanup
    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-full py-10">
      <span className="loading loading-ball loading-lg text-primary"></span>
    </div>
  );

  if (!notifs.length) return (
    <div className="alert alert-info shadow-lg mt-6 mx-6">
      <div>
        <Bell className="text-blue-500" size={24} />
        <span>No notifications available</span>
      </div>
    </div>
  );

  // Define accent colors to cycle through
  const colors = [
    'border-primary', 'border-secondary', 'border-accent',
    'border-info', 'border-success', 'border-warning', 'border-error'
  ];

  return (
    <div className="p-6 space-y-4">
      {notifs.map((n, idx) => (
        <div
          key={n._id}
          className={`card bg-base-200 shadow-lg p-4 border-l-8 ${colors[idx % colors.length]}`}
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg text-white">
              <Bell size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-800">{n.title}</h4>
              <p className="text-gray-700 mt-1">{n.message}</p>
            </div>
            <div className="badge badge-outline badge-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}