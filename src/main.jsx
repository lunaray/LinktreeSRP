import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeState from "./state/theme/themeState";
import { AuthProvider } from "./state/context/authContext";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeState>
      <AuthProvider>
        <Analytics />
        <App />
      </AuthProvider>
    </ThemeState>
  </BrowserRouter>
);