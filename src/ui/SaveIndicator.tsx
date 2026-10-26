import { useEffect, useState } from "react";
import { getProgressStore, useSaveStatus } from "../persistence/store";
export function SaveIndicator() {
  const status = useSaveStatus();
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const labels = {
    loading: "Opening local save…",
    saving: "Saving on this device…",
    saved: "Saved on this device",
    error: "Saving failed — retry",
    recovery: "Original save kept for recovery",
  };
  return (
    <div
      className={`save-indicator save-${status}`}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">
        {status === "saved" ? "✓" : status === "error" ? "!" : "·"}
      </span>
      {status === "error" ? (
        <button onClick={() => getProgressStore().flush()}>
          {labels[status]}
        </button>
      ) : (
        labels[status]
      )}
      {getProgressStore().getConflicts().length > 0 && (
        <a href="#progress"> · Draft versions need review</a>
      )}
      {offline && <span> · Offline; local editing available</span>}
    </div>
  );
}
