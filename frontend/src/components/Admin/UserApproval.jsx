import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import useAdminStore from "../../stores/useAdminStore.js";
import axios from "axios";

export default function UserApproval() {
  const { pendingUsers, fetchPendingUsers, approveUser } = useAdminStore();
  const [selected, setSelected] = useState(null);    // { user, role }
  const [formData, setFormData] = useState({});      // dynamic form fields

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const openModal = (user) => {
    setSelected(user);
    setFormData({});  // reset
    document.getElementById("approval-modal").checked = true;
  };

  const closeModal = () => {
    document.getElementById("approval-modal").checked = false;
    setSelected(null);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    const { _id: id, role } = selected;
    let url, payload;
    
    switch (role) {
      case "teacher":
        url = `/api/teacher/create/${id}`;
        payload = {
          subjects: formData.subjects?.split(",").map(s => s.trim()),
          experience: formData.experience,
          qualifications: formData.qualifications,
        };
        break;

      case "student":
        url = `/api/student/create/${id}`;
        payload = {
          RollNumber: formData.RollNumber,
          className: formData.className,
          section: formData.section,
          phoneNumber: formData.phoneNumber,
        };
        break;

      case "parent":
        url = `/api/parent/create/${id}`;
        payload = { phone: formData.phone };
        break;

      default:
        return;
    }

    // 1) Create the domain-specific record
    await axios.post(url, payload,{
      withCredentials : true
    });

    // 2) Finally, mark the user approved in your admin store
    await approveUser(id, "approve");
    closeModal();
  };

  // shared onChange
  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <>
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Pending Users
        </h2>

        {pendingUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-primary-content">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u._id}>
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-sm text-gray-600">{u.email}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openModal(u)}
                        className="btn btn-circle btn-sm btn-success"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => approveUser(u._id, "reject")}
                        className="btn btn-circle btn-sm btn-error"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No pending users.</p>
        )}
      </div>

      {/* DaisyUI Modal */}
      <input type="checkbox" id="approval-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-xl">
          <h3 className="font-bold text-lg mb-4">
            Approve as {selected?.role}
          </h3>

          <form onSubmit={handleApprove} className="space-y-4">
            {selected?.role === "teacher" && (
              <>
                <div>
                  <label className="label">
                    <span className="label-text">Subjects (comma-sep)</span>
                  </label>
                  <input
                    name="subjects"
                    onChange={onChange}
                    className="input input-bordered w-full"
                    placeholder="Math, Science"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Experience (years)</span>
                  </label>
                  <input
                    name="experience"
                    type="number"
                    onChange={onChange}
                    className="input input-bordered w-full"
                    placeholder="5"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Qualifications</span>
                  </label>
                  <input
                    name="qualifications"
                    onChange={onChange}
                    className="input input-bordered w-full"
                    placeholder="M.Ed, B.Sc"
                    required
                  />
                </div>
              </>
            )}

            {selected?.role === "student" && (
              <>
                <div>
                  <label className="label">
                    <span className="label-text">Roll Number</span>
                  </label>
                  <input
                    name="RollNumber"
                    onChange={onChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text">Class Name</span>
                    </label>
                    <input
                      name="className"
                      onChange={onChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text">Section</span>
                    </label>
                    <input
                      name="section"
                      onChange={onChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Parent Phone #</span>
                  </label>
                  <input
                    name="phoneNumber"
                    onChange={onChange}
                    className="input input-bordered w-full"
                    placeholder="+1-234-567-890"
                    required
                  />
                </div>
              </>
            )}

            {selected?.role === "parent" && (
              <div>
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  name="phone"
                  onChange={onChange}
                  className="input input-bordered w-full"
                  placeholder="+1-234-567-890"
                  required
                />
              </div>
            )}

            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
