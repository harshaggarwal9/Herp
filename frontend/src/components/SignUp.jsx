import React, { useState } from "react";
import useAuthStore from "../stores/useAuthStore.js";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { signup, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(name, email, password, role);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-grey-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg shadow-2xl bg-base-100 p-12 space-y-8 rounded-lg"
      >
        <h2 className="text-4xl font-extrabold text-center text-primary mb-4">
          Sign Up
        </h2>

        <div className="form-control mb-6">
          <label htmlFor="name" className="label mb-2">
            <span className="label-text font-medium ">Name</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your full name"
            className="input input-bordered w-full"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-control mb-6">
          <label htmlFor="email" className="label mb-2">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control mb-6">
          <label htmlFor="password" className="label mb-2">
            <span className="label-text font-medium ">Password</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="input input-bordered w-full "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-control mb-8">
          <label htmlFor="role" className="label mb-2">
            <span className="label-text font-medium">Role</span>
          </label>
          <select
            id="role"
            className="select select-bordered w-full"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
