import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../stores/useAuthStore";
import { User } from "lucide-react";

export const ParentProfileSection=()=> {
  const [profile, setProfile] = useState(null);
  const { user } = useAuthStore();
  const id = user?._id;

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:5000/api/parent/fetch/${id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!profile) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  const { userId, childrens, phoneNumber } = profile;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <div className="bg-blue-200 p-3 rounded-full">
          <User size={32} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{userId.name}</h2>
          <p className="text-gray-600">Email: {userId.email}</p>
          <p className="text-gray-600">Phone: {phoneNumber}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Children</h3>
        <div className="space-y-4">
          {childrens.map((child) => (
            <div
              key={child._id}
              className="flex items-center justify-between bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl p-5 shadow-lg hover:from-purple-200 hover:via-pink-200 hover:to-yellow-200 transition-colors duration-300"
            >
              <div>
                <p className="text-lg font-semibold text-purple-700 mb-1">{child.userId.name}</p>
                <p className="text-sm text-gray-600">
                  Class: <span className="font-medium text-gray-800">{child.classId.className}</span> - <span className="font-medium text-gray-800">{child.classId.section}</span>
                </p>
              </div>
              <div className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full shadow">
                Roll No: {child.RollNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

