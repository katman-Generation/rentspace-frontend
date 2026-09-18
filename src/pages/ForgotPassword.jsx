import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/password-reset/", {
        email,
      });

      setMessage(
        res.data?.detail ||
          "If an account exists with that email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure link to reset your password."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#1d2923]"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#1d2923] outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}

          {!loading && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#155c3a] hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}