import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function GetNotifications2() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/notification/get', {
          withCredentials: true,
        });
        setNotifs(data);
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    })();

    socket.on('notification', (newNotif) => {
      setNotifs((prev) => {
        if (prev.some((n) => n._id === newNotif._id)) return prev;
        return [newNotif, ...prev];
      });
      toast.success(`New: ${newNotif.title}`);
    });

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full py-10 text-white">
        <span className="loading loading-ball loading-lg text-primary"></span>
      </div>
    );

  if (!notifs.length)
    return (
      <div className="alert alert-info shadow-lg mt-6 mx-6 bg-white text-gray-800">
        <div>
          <Bell className="text-blue-500" size={24} />
          <span>No notifications available</span>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full p-6 overflow-y-auto bg-transparent">
      {notifs.map((n) => (
        <div
          key={n._id}
          className="bg-gradient-to-br from-red-100 via-rose-50 to-yellow-50 text-gray-800 rounded-2xl shadow-md px-6 py-4 flex justify-between items-start mb-6 transition duration-200 ease-in-out hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-pink-200 rounded-full text-red-600">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-800 mb-1 capitalize">
                {n.title}
              </h4>
              <p className="text-gray-700 text-sm">{n.message}</p>
            </div>
          </div>
          <div className="text-xs font-medium bg-white bg-opacity-70 text-gray-600 px-3 py-1 rounded-full shadow-sm whitespace-nowrap mt-1">
            {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
          </div>
        </div>
      ))}
    </div>
  );
}
