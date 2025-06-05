import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "teacher") {
        navigate("/teacher");
      } else if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "parent") {
        navigate("/parent");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-grey-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg shadow-2xl bg-base-100 p-12 space-y-8 rounded-lg"
      >
        <h2 className="text-4xl font-extrabold text-center text-primary mb-4">
          Login
        </h2>

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
            autoComplete="on"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control mb-8">
          <label htmlFor="password" className="label mb-2">
            <span className="label-text font-medium">Password</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="input input-bordered w-full"
            required
            autoComplete="on"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link to="/signup" className="text-blue-600 hover:underline">
          Don't have an account?
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
