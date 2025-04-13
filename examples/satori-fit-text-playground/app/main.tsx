import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
// @ts-expect-error font css has no types
import "@fontsource-variable/inter";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
