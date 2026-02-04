import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./app/App.jsx";
import { AppErrorBoundary } from "./shared/lib/errors/AppErrorBoundary.jsx";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
        }}
      />
    </AppErrorBoundary>
  </React.StrictMode>,
);
