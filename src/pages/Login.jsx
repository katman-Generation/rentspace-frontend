import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
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

          {error && (
            <p className="text-red-600 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              required
            />

            <button className="w-full bg-emerald-700 text-white py-2 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

