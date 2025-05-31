import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ RollNumber: "", amount: 0, dueDate: "" });

  // Fetch all pending fees
  const fetchFees = async () => {
    try {
      const res = await axios.get("/api/fees/all");
      setFees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitChallan = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/fees/create", formData);
      setModalOpen(false);
      setFormData({ RollNumber: "", amount: 0, dueDate: "" });
      fetchFees();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteChallan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this challan?")) return;
    try {
      await axios.delete(`/api/fees/delete/${id}`);
      setFees((prev) => prev.filter((fee) => fee._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Fee Management</h2>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Create Challan
        </button>
      </div>

      {/* Fee table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Amount (₹)</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee._id} className="hover">
                <td>{fee.student?.RollNumber}</td>
                <td>{fee.amount}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                  {fee.status === "Paid" ? (
                    <span className="badge badge-success">Paid</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteChallan(fee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Fee Challan</h3>
            <form onSubmit={submitChallan} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Student Roll Number</span>
                </label>
                <input
                  type="text"
                  name="RollNumber"
                  value={formData.RollNumber}
                  onChange={handleInput}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Amount (INR)</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInput}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Due Date</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInput}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}