import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeState from "./state/theme/themeState";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeState>
    <Analytics />
    <App />
  </ThemeState>
);