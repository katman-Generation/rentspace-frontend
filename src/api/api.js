import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
};

const isExpired = (token) => {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + 10;
};

const clearAuthTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh || isExpired(refresh)) {
    clearAuthTokens();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/api/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        const nextAccess = res?.data?.access;
        if (!nextAccess) {
          clearAuthTokens();
          return null;
        }
        localStorage.setItem("access", nextAccess);
        return nextAccess;
      })
      .catch(() => {
        clearAuthTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// attach token automatically
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("access");

  if (token && isExpired(token)) {
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthTokens();
    }
    return Promise.reject(error);
  }
);

export default api;
