import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import api from "../api/api";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/password-reset-confirm/", {
        uid,
        token,
        new_password: password,
      });

      setSuccess(true);

      // Give the user a moment to see the success message.
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);

      const responseData = err?.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);
      } else if (responseData?.new_password) {
        const passwordError = Array.isArray(responseData.new_password)
          ? responseData.new_password[0]
          : responseData.new_password;

        setError(passwordError);
      } else {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password reset."
        subtitle="Your password has been changed successfully."
        footerText="Ready to continue?"
        footerLinkText="Sign in"
        footerLink="/login"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm leading-6 text-green-700">
            Your password has been reset successfully. Redirecting you to
            sign in...
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl"
          >
            Sign in now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create a new password."
      subtitle="Choose a strong password for your RentSpace account."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
            {error}
          </div>
        )}

        {/* New password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-[#1d2923]"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              autoComplete="new-password"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 pr-20 text-sm text-[#1d2923] outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#155c3a] hover:text-[#0d3f29]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Use at least 8 characters and avoid common passwords.
          </p>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-[#1d2923]"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              required
              autoComplete="new-password"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 pr-20 text-sm text-[#1d2923] outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#155c3a] hover:text-[#0d3f29]"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Resetting password..." : "Reset password"}

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