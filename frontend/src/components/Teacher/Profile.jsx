import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { user } = useAuthStore();
  console.log(user);
  const id = user?._id;

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/teacher/fetch/${id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [id]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Helper to get initials safely
  const getInitials = (fullName = "") => {
    if (typeof fullName !== 'string' || fullName.trim() === '') return '';
    const parts = fullName.trim().split(/\s+/);
    const initials = parts
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4 mb-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl">
                {getInitials(profile.userId.name)}
              </div>
            </div>
            <div>
              <h2 className="card-title text-3xl">{profile.userId.name || 'No Name'}</h2>
              <p className="text-sm opacity-70">{profile.userId.email || 'No Email'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-200 p-4 rounded-lg">
              <div className="stat-title">Subjects</div>
              <div className="stat-value text-lg">
                {Array.isArray(profile.subjects) && profile.subjects.length > 0
                  ? profile.subjects.join(", ")
                  : 'N/A'}
              </div>
            </div>

            <div className="stat bg-base-200 p-4 rounded-lg">
              <div className="stat-title">Experience</div>
              <div className="stat-value text-lg">
                {typeof profile.experience === 'number'
                  ? `${profile.experience} ${profile.experience > 1 ? 'years' : 'year'}`
                  : 'N/A'}
              </div>
            </div>

            <div className="stat bg-base-200 p-4 rounded-lg md:col-span-2">
              <div className="stat-title">Qualifications</div>
              <div className="stat-value text-lg">
                {profile.qualification || 'N/A'}
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
