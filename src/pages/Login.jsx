import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to continue discovering spaces across Zimbabwe."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLink="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="mb-5">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setError("");
                setLoading(true);

                await googleLogin(credentialResponse.credential);

                navigate("/");
              } catch (err) {
                console.error(err);

                setError(
                  err?.response?.data?.detail ||
                    "Google sign-in failed. Please try again."
                );
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              setError("Google sign-in failed. Please try again.");
            }}
            useOneTap={false}
          />
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#1d2923]"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#155c3a] transition hover:text-[#0d3f29] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#1d2923] outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}

          {!loading && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

      </form>
    </AuthLayout>
  );
}