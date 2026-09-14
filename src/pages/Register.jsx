import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e) => {
    if (!agreedToTerms) {
      setError(
        "Please agree to the Terms & Conditions and acknowledge the Privacy Policy."
      );
      setLoading(false);
      return;
    }
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        email,
        firstName,
        lastName,
        phoneNumber,
        password
      );

      navigate("/");
    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      if (data) {
        const firstError = Object.values(data).flat()?.[0];

        setError(
          firstError ||
            "We couldn't create your account. Please check your details."
        );
      } else {
        setError("We couldn't create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Join RentSpace and start discovering spaces across Zimbabwe."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-semibold text-[#1d2923]"
            >
              First name
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              autoComplete="given-name"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-semibold text-[#1d2923]"
            >
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Surname"
              required
              autoComplete="family-name"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
            />
          </div>

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
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-2 block text-sm font-semibold text-[#1d2923]"
          >
            Phone number
          </label>

          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+263 77 123 4567"
            required
            autoComplete="tel"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-[#1d2923]"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#155c3a] focus:ring-4 focus:ring-[#155c3a]/10"
          />

          <p className="mt-2 text-xs text-gray-400">
            Use a strong password with at least 8 characters.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !agreedToTerms}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#155c3a] px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3f29] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}

          {!loading && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 text-xs leading-5 text-gray-500">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#155c3a]"
            />

            <span>
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#155c3a] hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and acknowledge that I have read the{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#155c3a] hover:underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 text-xs leading-5 text-gray-400">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[#155c3a]"
            />

            <span>
              I'd like to receive updates and offers from RentSpace.
            </span>
          </label>
        </div>

      </form>
    </AuthLayout>
  );
}
