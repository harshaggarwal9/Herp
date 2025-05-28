import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react';

export default function GetNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('https://mjerp.onrender.com/api/notification/get', { withCredentials: true });
        setNotifs(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (!notifs.length) {
    return <div className="p-6 text-center text-gray-500">No notifications available</div>;
  }

  return (
    <div className="p-6 grid gap-4">
      {notifs.map((n) => (
        <div
          key={n._id}
          className="card bg-base-100 shadow-lg p-4 flex space-x-4 items-start border"
        >
          <div className="p-2 rounded-full bg-primary text-white">
            <Bell size={20} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{n.title}</h4>
            <p className="text-gray-600 mt-1">{n.message}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
