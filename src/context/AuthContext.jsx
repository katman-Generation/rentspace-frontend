import { useEffect, useState } from "react";
import api from "../api/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/api/login/", {
      email,
      password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    await fetchProfile();
  };

  // REGISTER
  const register = async (
    email,
    firstName,
    lastName,
    phoneNumber,
    password
  ) => {
    const res = await api.post("/api/register/", {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      password,
    });

    if (res?.data?.access && res?.data?.refresh) {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      await fetchProfile();
      return;
    }

    // Fallback: login after registration
    await login(email, password);
  };

  // FETCH PROFILE
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

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const googleLogin = async (credential) => {
    const res = await api.post("/api/google-login/", {
      credential,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        googleLogin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

