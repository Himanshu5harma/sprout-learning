import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/dm-mono/latin-400.css";
import "./design-system.css";
import "./learning.css";
import "./responsive.css";
import { useSaveStatus } from "./persistence/store";
import { SaveIndicator } from "./ui/SaveIndicator";
import { ErrorBoundary } from "./ui/ErrorBoundary";
function StorageGate() {
  const status = useSaveStatus();
  if (status === "loading")
    return (
      <p className="loading-feature" role="status">
        Opening your local learning space…
      </p>
    );
  return (
    <>
      {(status === "error" || status === "recovery") && (
        <div className="ui-feedback ui-feedback-error">
          <SaveIndicator />
          <p>
            Your existing save has been kept. Export your work from My progress
            before clearing browser data.
          </p>
        </div>
      )}
      <App />
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <StorageGate />
    </ErrorBoundary>
  </React.StrictMode>,
);
