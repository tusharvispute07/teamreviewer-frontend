import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", { name, email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to register. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-300 font-sans selection:bg-zinc-200 selection:text-black">
      <div className="relative z-10 w-full max-w-sm m-auto p-6 md:p-8">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-8 flex items-baseline gap-1 select-none">
            <span className="text-3xl font-bold tracking-tight text-white">Team</span>
            <span className="text-3xl font-light tracking-tight text-zinc-500">Reviewer</span>

          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2 text-center">
            Create an account
          </h1>
          <p className="text-zinc-500 text-sm text-center">
            Enter your details to get started.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-700 sm:text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="group">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-700 sm:text-sm"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="group">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-widest group-focus-within:text-zinc-300 transition-colors"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 text-zinc-100 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-700 sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 mt-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-all sm:text-sm"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-white hover:underline underline-offset-4 transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
