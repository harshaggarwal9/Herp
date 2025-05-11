// components/UserApproval.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

export default function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/pending-users").then(res => setPendingUsers(res.data));
  }, []);

  const handleDecision = async (id, approve) => {
    await axios.post(`/api/admin/approve-user/${id}`, { approve });
    setPendingUsers(prev => prev.filter(user => user._id !== id));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Pending Users</h2>
      {pendingUsers.map(user => (
        <div key={user._id} className="flex justify-between items-center border-b py-2">
          <span>{user.name} ({user.email})</span>
          <div className="flex gap-2">
            <button onClick={() => handleDecision(user._id, true)} className="bg-green-500 p-2 rounded text-white">
              <Check size={18} />
            </button>
            <button onClick={() => handleDecision(user._id, false)} className="bg-red-500 p-2 rounded text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
