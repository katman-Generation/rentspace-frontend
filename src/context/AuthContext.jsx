import { useEffect, useState } from "react";
import api from "../api/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const res = await api.post("/api/login/", { username, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    await fetchProfile();
  };

  // ✅ REGISTER
  const register = async (username, email, password) => {
    const res = await api.post("/api/register/", { username, email, password });

    if (res?.data?.access && res?.data?.refresh) {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      await fetchProfile();
      return;
    }

    await login(username, password);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/profile/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
