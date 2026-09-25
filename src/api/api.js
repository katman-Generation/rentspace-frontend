import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});


// ============================================================
// TOKEN HELPERS
// ============================================================

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return typeof payload.exp === "number"
      ? payload.exp
      : null;

  } catch {
    return null;
  }
};


const isExpired = (token) => {

  const exp = getTokenExpiry(token);

  if (!exp) {
    return true;
  }

  const now = Math.floor(
    Date.now() / 1000
  );

  return exp <= now + 10;
};


const clearAuthTokens = () => {

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};


// ============================================================
// ACCESS TOKEN REFRESH
// ============================================================

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
        `${API_BASE_URL}/api/refresh/`,
        {
          refresh,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      .then((res) => {

        const nextAccess = res?.data?.access;

        if (!nextAccess) {

          clearAuthTokens();

          return null;
        }

        localStorage.setItem(
          "access",
          nextAccess
        );

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


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  async (config) => {

    let token = localStorage.getItem("access");

    if (token && isExpired(token)) {

      token = await refreshAccessToken();
    }

    if (token) {

      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    } else if (config.headers?.Authorization) {

      delete config.headers.Authorization;
    }


    // --------------------------------------------------------
    // FormData
    // --------------------------------------------------------

    const isFormData =
      typeof FormData !== "undefined" &&
      config.data instanceof FormData;

    if (isFormData) {

      /*
       * Let the browser set the multipart boundary.
       */
      delete config.headers["Content-Type"];

    } else {

      config.headers = config.headers || {};

      if (!config.headers["Content-Type"]) {

        config.headers["Content-Type"] =
          "application/json";
      }
    }

    return config;
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error?.response?.status === 401) {

      clearAuthTokens();
    }

    return Promise.reject(error);
  }
);


// ============================================================
// RENTSPACE API HELPERS
// ============================================================

export const getSpaces = (params = {}) =>
  api.get("/api/spaces/", {
    params,
  });


export const getSpace = (id) =>
  api.get(`/api/spaces/${id}/`);


export const getCategories = () =>
  api.get("/api/spaces/categories/");


export const getSpaceTypes = (params = {}) =>
  api.get("/api/spaces/space-types/", {
    params,
  });


export const getAmenities = () =>
  api.get("/api/spaces/amenities/");


export const getLocations = () =>
  api.get("/api/spaces/locations/");


export const getInstitutions = () =>
  api.get("/api/spaces/institutions/");


export const createSpace = (data) =>
  api.post(
    "/api/spaces/create/",
    data
  );


export const updateSpace = (id, data) =>
  api.patch(
    `/api/spaces/update/${id}/`,
    data
  );


export const getMySpaces = () =>
  api.get("/api/spaces/my-spaces/");


export default api;