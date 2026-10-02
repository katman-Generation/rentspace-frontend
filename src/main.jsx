import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
        <Analytics />
      </AuthProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "RentSpace service worker registered:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error(
          "RentSpace service worker registration failed:",
          error
        );
      });
  });
}
