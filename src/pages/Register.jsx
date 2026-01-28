import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      navigate("/"); // ✅ success
    } catch (err) {
      setError("Registration failed. Try a different username or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-md border-t-4 border-red-600">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
