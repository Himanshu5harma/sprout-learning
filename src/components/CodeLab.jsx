import { useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Square,
  Terminal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import { EditorWorkspace, WorkspaceToggle } from "./EditorWorkspace";
import { runJavaScript } from "../runner.js";
import {
  createReactSession,
  previewDocument,
} from "../execution/react-session";
import { SaveIndicator } from "../ui/SaveIndicator";
import { useDraft, useStorageGeneration } from "../persistence/store";
import { explainError } from "../learning/errors.js";
import { codeFingerprint } from "../learning/progress.js";

export function CodeBlock({
  code,
  language = "JavaScript",
  label = "Working example",
  discussedLine,
}) {
  return (
    <div className="example-card highlighted-example">
      <div className="editor-toolbar">
        <span>
          <span
            className={`file-dot ${language === "React" ? "blue" : "yellow"}`}
          />
          Code · {language === "React" ? "App.jsx" : "example.js"}
        </span>
        <span>Read-only example</span>
      </div>
      <CodeEditor
        value={code}
        language={language}
        readOnly
        label={label}
        discussedLine={discussedLine}
      />
    </div>
  );
}

function ErrorFeedback({ error, name }) {
  const feedback = explainError(error, name);
  return (
    <div className="learning-error" role="alert">
      <strong>
        <AlertCircle size={17} />
        {feedback.title}
      </strong>
      <p>{feedback.suggestion}</p>
      <details>
        <summary>Technical detail</summary>
        <pre>{feedback.details}</pre>
      </details>
    </div>
  );
}

export function CheckResults({ checks }) {
  if (!checks?.length) return null;
  const passed = checks.every((check) => check.passed);
  return (
    <div
      className={`behaviour-results ${passed ? "all-passed" : "needs-work"}`}
      role="status"
      aria-live="polite"
    >
      <h4>
        {passed ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        {passed
          ? "These behaviour checks passed"
          : "Here is the mismatch to work on"}
      </h4>
      {checks.map((check, index) => (
        <div
          className={`behaviour-result ${check.passed ? "passed" : "failed"}`}
          key={index}
        >
          <strong>
            {check.passed ? "✓ Passed:" : "↳ Check:"} {check.label}
          </strong>
          {!check.passed && (
            <>
              <div className="result-comparison">
                <div>
                  <span>Expected</span>
                  <pre>{check.expected}</pre>
                </div>
                <div>
                  <span>Observed</span>
                  <pre>{check.actual}</pre>
                </div>
              </div>
              <p>{check.help}</p>
            </>
          )}
        </div>
      ))}
      <p className="check-scope">
        This verifies the listed cases. It does not prove every input, code
        quality, or mastery.
      </p>
    </div>
  );
}

export default function CodeLab({
  initialCode = "",
  language = "JavaScript",
  draftKey,
  drafts,
  saveDraft,
  compact = false,
  challenge,
  task,
  onResult,
  guidance = false,
  onAssistance,
}) {
  const savedCode = useDraft(draftKey || "");
  const [code, setCode] = useState(
    () => savedCode ?? drafts?.[draftKey] ?? initialCode,
  );
  useEffect(() => {
    setCode(savedCode ?? initialCode);
  }, [savedCode, initialCode]);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [checks, setChecks] = useState(null);
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hint, setHint] = useState(0);
  const [solution, setSolution] = useState(false);
  const [lastRun, setLastRun] = useState("");
  const frame = useRef(null);
  const timer = useRef(null);
  const job = useRef(null);
  const execution = useRef(null);
  const callbacks = useRef({ onResult });
  callbacks.current = { onResult };
  const isReact = language === "React";
  const generation = useStorageGeneration();
  useEffect(() => {
    execution.current?.dispose();
    job.current?.controller.abort();
    job.current = null;
    setRunning(false);
    setPreview(null);
    setOutput(null);
    setChecks(null);
    setError(null);
    setLastRun("");
  }, [generation]);

  function stop() {
    execution.current?.dispose();
    job.current?.controller.abort();
    job.current = null;
    clearTimeout(timer.current);
    setRunning(false);
    if (isReact) setPreview(null);
  }
  useEffect(
    () => () => {
      execution.current?.dispose();
      job.current?.controller.abort();
      clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (!preview || !frame.current || !job.current) return;
    execution.current = createReactSession({
      frame: frame.current,
      runId: preview.id,
      code: preview.source,
      checks: preview.checks,
      signal: job.current.controller.signal,
      onLog: (line) =>
        setOutput((lines) => [...(lines || []), line].slice(-150)),
      onError: (message, name) => {
        setRunning(false);
        setError({ message, name });
      },
      onResult: (result) => {
        if (job.current?.id !== preview.id) return;
        setRunning(false);
        if (preview.checking) {
          setChecks(result.checks);
          callbacks.current.onResult?.({
            code: preview.source,
            passed:
              !result.error &&
              result.checks.length === preview.checks.length &&
              result.checks.every((check) => check.passed),
            checks: result.checks,
            error: result.error,
          });
        }
      },
    });
    return () => {
      execution.current?.dispose();
      execution.current = null;
    };
  }, [preview]);

  async function run(checking = false) {
    if (running) return;
    execution.current?.dispose();
    execution.current = null;
    job.current?.controller.abort();
    const source = code;
    const controller = new AbortController();
    const id = crypto.randomUUID();
    job.current = { id, controller };
    setRunning(true);
    setError(null);
    setChecks(null);
    setOutput([]);
    setLastRun(source);
    saveDraft?.(draftKey, source);
    if (checking && guidance && solution) onAssistance?.();
    const requested = checking ? task?.checks || [] : [];
    if (isReact) {
      setPreview({ id, source, checks: requested, checking });
      return;
    }
    const result = await runJavaScript(source, {
      checks: requested,
      signal: controller.signal,
    });
    if (controller.signal.aborted || job.current?.id !== id || result.cancelled)
      return;
    setRunning(false);
    setOutput(result.lines);
    setChecks(checking ? result.checks : null);
    if (result.error)
      setError({ message: result.error, name: result.errorName });
    if (checking)
      onResult?.({
        code: source,
        passed:
          !result.error &&
          result.checks.length === requested.length &&
          result.checks.every((check) => check.passed),
        checks: result.checks,
        error: result.error,
      });
    if (challenge && !result.error) {
      const matched = result.lines.some((line) => {
        try {
          return (
            JSON.stringify(JSON.parse(line)) ===
            JSON.stringify(challenge.expected)
          );
        } catch {
          return false;
        }
      });
      setChecks([
        {
          label: "Printed result",
          passed: matched,
          expected: JSON.stringify(challenge.expected, null, 2),
          actual: result.lines.join("\n"),
          help: "Your output should be one array containing the requested values in order. map transforms items; filter keeps matching items. Read the prerequisite lesson if that distinction is new.",
        },
      ]);
    }
  }

  const stale = lastRun && codeFingerprint(lastRun) !== codeFingerprint(code);
  const srcDoc = previewDocument(location.origin);
  return (
    <EditorWorkspace
      className={`lab-wrapper ${compact ? "compact" : ""}`}
      label={`${language} practice workspace`}
    >
      <p className="sr-only" role="status">
        {running
          ? "Running code."
          : error
            ? ""
            : preview
              ? "React preview is ready."
              : output !== null
                ? "The program is no longer running. Console output is below."
                : ""}
      </p>
      <div className={`code-lab ${compact ? "compact" : ""}`}>
        <div className="editor-panel">
          <div className="editor-toolbar">
            <span>
              <span className={`file-dot ${isReact ? "blue" : "yellow"}`} />
              Code · {isReact ? "App.jsx" : "playground.js"}
            </span>
            <div>
              <WorkspaceToggle />
              <button
                className="icon-button"
                title="Reset code to the current starter"
                aria-label="Reset code"
                disabled={running}
                onClick={() => {
                  execution.current?.dispose();
                  execution.current = null;
                  job.current?.controller.abort();
                  setCode(initialCode);
                  saveDraft?.(draftKey, initialCode);
                  setChecks(null);
                  setOutput(null);
                  setError(null);
                  setPreview(null);
                }}
              >
                <RotateCcw size={15} />
              </button>
              {isReact && preview && !running && (
                <button className="text-button" onClick={stop}>
                  Stop preview
                </button>
              )}
              {running ? (
                <button className="run-button" onClick={stop}>
                  <Square size={12} fill="currentColor" />
                  Stop
                </button>
              ) : (
                <button className="run-button" onClick={() => run(false)}>
                  <Play size={13} fill="currentColor" />
                  Run code
                </button>
              )}
            </div>
          </div>
          <CodeEditor
            value={code}
            language={language}
            label={`${language} code editor`}
            onChange={(value) => {
              setCode(value);
              saveDraft?.(draftKey, value);
            }}
            onRun={() => run(false)}
          />
          <div className="editor-footer">
            <SaveIndicator />
            <span>{isReact ? "React + JSX" : "JavaScript · isolated VM"}</span>
            <span>Tab moves focus · ⌘ / Ctrl + Enter runs</span>
          </div>
        </div>
        <div className="output-panel">
          <div className="output-toolbar">
            <span>
              <Terminal size={15} />
              {isReact ? "Output · Live preview" : "Output · Console"}
            </span>
            {!isReact && output?.length > 0 && (
              <button className="text-button" onClick={() => setOutput([])}>
                Clear
              </button>
            )}
          </div>
          {running && (
            <p className="execution-loading">
              {isReact
                ? "Preparing your isolated React preview…"
                : "Running your program…"}
            </p>
          )}
          {error && <ErrorFeedback error={error.message} name={error.name} />}
          {isReact && preview ? (
            <iframe
              key={preview.id}
              ref={frame}
              title="Your React component preview"
              sandbox="allow-scripts allow-forms"
              srcDoc={srcDoc}
            />
          ) : !isReact && output ? (
            <div className="console-output" aria-live="polite">
              {output.length ? (
                output.map((line, index) => (
                  <pre key={index}>
                    <span aria-hidden="true" className="console-chevron">
                      ›
                    </span>
                    {line}
                  </pre>
                ))
              ) : (
                <p className="muted">
                  {running
                    ? "Running…"
                    : "No values were printed. Use console.log to print; a return value is not automatically console output."}
                </p>
              )}
            </div>
          ) : (
            <div className="output-empty">
              <span className="empty-code-icon">
                <Terminal size={30} strokeWidth={1.4} />
              </span>
              <h4>Run code to see the result.</h4>
              <p>
                {isReact
                  ? "React displays the interface described by App."
                  : "console.log prints here. Calculations alone do not print."}
              </p>
            </div>
          )}
          {isReact && output?.length > 0 && (
            <details className="preview-console" open>
              <summary>Preview console ({output.length} messages)</summary>
              {output.map((line, index) => (
                <pre key={index}>{line}</pre>
              ))}
            </details>
          )}
        </div>
      </div>
      {stale && (
        <p className="stale-result" role="status">
          The code has changed since this result. Run or check the current
          version again.
        </p>
      )}
      {task && (
        <div className="check-actions">
          <button
            className="primary-button"
            disabled={running}
            onClick={() => run(true)}
          >
            <CheckCircle2 size={16} />
            {running ? "Running…" : "Check behaviour"}
          </button>
          <p>
            {isReact
              ? "Checks use fresh previews and perform the listed interactions."
              : "Checks execute the code and inspect outputs or returned values, including the listed edge cases."}
          </p>
        </div>
      )}
      {checks && <CheckResults checks={checks} />}
      {guidance && task && (
        <div className="challenge-hint project-guidance">
          <button
            className="text-button"
            disabled={hint >= task.hints.length}
            onClick={() => setHint((value) => value + 1)}
          >
            {hint === 0
              ? "Show a conceptual hint"
              : hint < task.hints.length
                ? "Show a more specific hint"
                : "All hints shown"}
          </button>
          {task.hints.slice(0, hint).map((item, index) => (
            <p key={index}>
              <strong>Hint {index + 1}:</strong> {item}
            </p>
          ))}
          <button
            className="text-button solution-toggle"
            onClick={() => {
              if (!solution) onAssistance?.();
              setSolution(!solution);
            }}
          >
            {solution ? "Hide solution" : "Show explained solution"}
          </button>
          {solution && (
            <>
              <p className="assistance-note">
                This is a learning aid. Behaviour checked after viewing a
                solution is labeled as assisted.
              </p>
              <CodeBlock
                code={task.solution}
                language={language}
                label="Project solution"
              />
              <p>{task.explanation}</p>
            </>
          )}
        </div>
      )}
      {challenge && (
        <div className="challenge-hint">
          <button
            className="text-button"
            onClick={() => setHint((value) => Math.min(value + 1, 2))}
          >
            {hint ? "Show a more specific hint" : "Show a hint"}
          </button>
          {hint > 0 && (
            <p>
              Decide whether you need to transform every item or keep only some
              items.
            </p>
          )}
          {hint > 1 && <p>{challenge.hint}</p>}
          <button
            className="text-button solution-toggle"
            onClick={() => setSolution(!solution)}
          >
            {solution ? "Hide explained solution" : "Show explained solution"}
          </button>
          {solution && (
            <>
              <CodeBlock
                code={challenge.solution}
                label="Daily challenge solution"
              />
              <p>{challenge.solutionExplanation}</p>
            </>
          )}
        </div>
      )}
    </EditorWorkspace>
  );
}
