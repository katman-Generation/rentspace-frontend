import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-md border-t-4 border-emerald-700">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
            Login
          </h2>

          {loading && (
            <div className="mb-4">
              <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                <div className="h-full w-full bg-emerald-700 animate-pulse" />
              </div>
              <p className="text-xs text-gray-600 mt-1">Signing in...</p>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              disabled={loading}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              disabled={loading}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
