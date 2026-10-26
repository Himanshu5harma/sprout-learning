import { useRef, useState } from "react";
import { getProgressStore, useProgress } from "../../persistence/store";
import { Button, Card, Dialog, Feedback, Field } from "../../ui/primitives";
import { SaveIndicator } from "../../ui/SaveIndicator";

export function DataControls() {
  const [progress, update] = useProgress();
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [scope, setScope] = useState<"drafts" | "evidence" | "all" | null>(
    null,
  );
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const store = getProgressStore();
  const conflicts = store.getConflicts();
  async function exportData() {
    try {
      const data = await store.exportData();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `sprout-progress-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setFailed(false);
      setMessage(
        "Export downloaded. It includes your code and profile; keep it somewhere private.",
      );
    } catch {
      setFailed(true);
      setMessage(
        "The export could not be created. Your saved data has not been changed.",
      );
    }
  }
  async function chooseVersion(id: string, choice: "local" | "other") {
    try {
      const resolved = await store.resolveConflict(id, choice);
      setFailed(false);
      setMessage(
        resolved
          ? "Selected version saved."
          : "Another version was saved while you compared. Review the updated versions below.",
      );
    } catch {
      setFailed(true);
      setMessage(
        "The version could not be saved. Both copies are kept; retry.",
      );
    }
  }
  return (
    <Card>
      <h2>Your data, on this device</h2>
      <p>
        Drafts and progress stay in this browser on this device. Export a copy
        before changing browsers or clearing site data. There is no automatic
        cross-device sync.
      </p>
      <SaveIndicator />
      {Array.isArray(progress.storageValidationWarnings) &&
        progress.storageValidationWarnings.length > 0 && (
          <Feedback>
            Some older saved fields could not be read. Valid work was kept; the
            original save remains available for recovery.
          </Feedback>
        )}
      <div className="progress-actions">
        <Button variant="secondary" onClick={exportData}>
          Export progress
        </Button>
        <Button variant="secondary" onClick={() => input.current?.click()}>
          Import and merge
        </Button>
        <Button variant="quiet" onClick={() => setScope("drafts")}>
          Reset code drafts
        </Button>
        <Button variant="quiet" onClick={() => setScope("evidence")}>
          Reset check evidence
        </Button>
        <Button variant="danger" onClick={() => setScope("all")}>
          Delete local learning data
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        aria-label="Import Sprout progress file"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            if (file.size > 8000000) throw new Error("File too large");
            const raw: unknown = JSON.parse(await file.text());
            await store.importData(raw);
            await store.flush();
            if (store.getStatus() !== "saved") throw new Error("Saving failed");
            setFailed(false);
            setMessage(
              "Valid progress merged. Existing drafts were kept; any different imported drafts are available below as alternatives.",
            );
          } catch {
            setFailed(true);
            setMessage(
              "This file is not a valid Sprout version 3 progress export, or is too large. No data was imported.",
            );
          }
          event.target.value = "";
        }}
      />
      <label className="progress-actions">
        <input
          type="checkbox"
          checked={!!progress.streaksEnabled}
          onChange={(event) =>
            update((p) => ({ ...p, streaksEnabled: event.target.checked }))
          }
        />
        Show optional streak encouragement
      </label>
      {message && (
        <Feedback tone={failed ? "error" : "success"}>{message}</Feedback>
      )}
      {!!conflicts.length && (
        <div>
          <h3>Draft versions need your choice</h3>
          <p>
            Both versions were saved. Compare them before choosing which one to
            continue editing.
          </p>
          {conflicts.map((conflict) => (
            <Card key={conflict.id}>
              <h3>
                {conflict.field === "reflections" ? "Reflection · " : ""}
                {conflict.key}
              </h3>
              <p>
                Alternative version · {new Date(conflict.at).toLocaleString()}
              </p>
              <pre className="conflict-code">{conflict.local}</pre>
              <p>Current saved version</p>
              <pre className="conflict-code">{conflict.other}</pre>
              <div className="progress-actions">
                <Button onClick={() => chooseVersion(conflict.id, "local")}>
                  Continue with alternative
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => chooseVersion(conflict.id, "other")}
                >
                  Keep current saved version
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {scope && (
        <Dialog
          label={
            scope === "all"
              ? "Delete local learning data"
              : "Reset selected learning data"
          }
          className="confirm-dialog"
          onClose={() => {
            if (!busy) {
              setScope(null);
              setConfirmation("");
            }
          }}
        >
          <h2>
            {scope === "all"
              ? "Delete learning data from this browser?"
              : `Reset ${scope === "drafts" ? "code drafts" : "check evidence"}?`}
          </h2>
          <p>
            {scope === "all"
              ? "This removes drafts, completions, bookmarks, checklist entries, history, and migration backups. Other open Sprout tabs will also update. Download an export first if you want a recovery copy."
              : scope === "drafts"
                ? "This removes saved code drafts and alternative versions. Historical lesson completions and project checklists stay. Passed checks may need rechecking."
                : "This removes practical checks, knowledge checks, and predictions. Historical lesson completions, drafts, project checklists, and history stay."}
          </p>
          {scope === "all" && (
            <Field
              label="Type DELETE to confirm"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
            />
          )}
          <div className="progress-actions">
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setScope(null);
                setConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={busy || (scope === "all" && confirmation !== "DELETE")}
              onClick={async () => {
                setBusy(true);
                try {
                  await store.reset(scope);
                  setFailed(false);
                  setMessage("The selected local data was removed.");
                  setScope(null);
                  setConfirmation("");
                } catch {
                  setFailed(true);
                  setMessage("The reset could not be saved. Please retry.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy
                ? "Saving…"
                : scope === "all"
                  ? "Delete confirmed data"
                  : "Reset selected data"}
            </Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
