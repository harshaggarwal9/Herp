import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const {user} = useAuthStore();
  const id = user._id;
  useEffect(() => {
    axios.get(`http://localhost:5000/api/teacher/fetch/${id}`).then(res => setProfile(res.data));
  }, []);

  if (!profile) return <p>Loading...</p>;
  return (
    <div className="card bg-base-100 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <User className="mr-2" /> Profile
      </h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Subjects:</strong> {profile.subjects.join(", ")}</p>
        <p><strong>Experience:</strong> {profile.experience} years</p>
        <p><strong>Qualifications:</strong> {profile.qualification}</p>
      </div>
    </div>
  );
}