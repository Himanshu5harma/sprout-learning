import { runJavaScript } from "../../src/execution/client";
import {
  createReactSession,
  previewDocument,
} from "../../src/execution/react-session";
import type { ExecutionResult } from "../../src/execution/protocol";
export interface Fixture {
  id: string;
  code: string;
  checks: unknown[];
  expectedPass: boolean;
  expectedLines?: string[];
}
declare global {
  interface Window {
    runFixture: (
      fixture: Fixture,
      language: "JavaScript" | "React",
    ) => Promise<ExecutionResult>;
  }
}
window.runFixture = async (fixture, language) => {
  if (language === "JavaScript")
    return runJavaScript(fixture.code, { checks: fixture.checks });
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    frame.title = fixture.id;
    frame.setAttribute("sandbox", "allow-scripts allow-forms");
    frame.style.cssText = "width:740px;height:640px;border:0";
    const controller = new AbortController();
    const logs: string[] = [];
    const session = createReactSession({
      frame,
      runId: crypto.randomUUID(),
      code: fixture.code,
      checks: fixture.checks,
      signal: controller.signal,
      onLog: (line) => logs.push(line),
      onError: () => {},
      onResult: (result) => {
        resolve({ ...result, lines: logs });
        queueMicrotask(() => {
          controller.abort();
          session.dispose();
          frame.remove();
        });
      },
    });
    frame.srcdoc = previewDocument(location.origin);
    document.body.append(frame);
  });
};
