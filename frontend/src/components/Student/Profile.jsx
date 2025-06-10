import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../stores/useAuthStore";
import { User } from "lucide-react";
function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const {user} = useAuthStore();
  const id = user?._id;
  useEffect(() => {
    axios.get(`/api/student/profile/${id}`).then(res => setProfile(res.data)).catch(console.error);
  }, []);

  if (!profile) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <div className="bg-purple-200 p-3 rounded-full">
          <User size={32} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{profile.userId.name}</h2>
          <p className="text-gray-600">Roll No: {profile.RollNumber}</p>
          <p className="text-gray-600">Class: {profile.classId.className} - {profile.classId.section}</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-gray-700"><span className="font-medium">Email:</span> {profile.userId.email}</p>
        <p className="text-gray-700"><span className="font-medium">Phone:</span> {profile.parent.phoneNumber}</p>
        <p className="text-gray-700"><span className="font-medium">Parent:</span> {profile.parent.userId.name}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
export default ProfileSection;