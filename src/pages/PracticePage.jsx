import { Braces, Lightbulb } from "lucide-react";
import { Atom, PageHeading } from "../shared/presentation.jsx";
import { jsStarter, reactStarter } from "../generated/catalog.js";

import CodeLab from "../components/CodeLab.jsx";

export default function PracticePage({
  labProject,
  labLanguage,
  setLabLanguage,
  setLabProject,
  progress,
  setProgress,
  saveDraft,
  recordAssistance,
  recordPractice,
}) {
  return (
    <>
      <PageHeading
        eyebrow="YOUR SAFE SPACE TO FIGURE IT OUT"
        title={
          labProject ? labProject.title : "A little code. A little confidence."
        }
        description={
          labProject
            ? labProject.description
            : "Try an idea, change a line, see what happens. Learning lives in the doing."
        }
      />
      <div className="lab-heading">
        <div className="filter-tabs">
          {["JavaScript", "React"].map((lang) => (
            <button
              key={lang}
              className={labLanguage === lang ? "selected" : ""}
              onClick={() => {
                setLabLanguage(lang);
                setLabProject(null);
              }}
            >
              {lang === "React" ? <Atom size={16} /> : <Braces size={16} />}{" "}
              {lang}
            </button>
          ))}
        </div>
        <span className="autosave">
          <span className="live-dot" /> Local practice · no account needed
        </span>
      </div>
      {labProject && (
        <div className="project-lab-brief">
          <h3>Your building checklist</h3>
          <p className="self-report-label">
            Self-reported review. Checking these boxes does not run tests or
            verify code.
          </p>
          <div className="project-task-detail">
            <h3>{labProject.task.goal}</h3>
            <p>
              <strong>Starting information:</strong> {labProject.task.starting}
            </p>
            <p>
              <strong>Your task:</strong> {labProject.task.instructions}
            </p>
            <p>
              <strong>Expected behaviour:</strong> {labProject.task.expected}
            </p>
            <p>
              <strong>Constraints:</strong> {labProject.task.constraints}
            </p>
          </div>
          {labProject.requirements.map((req, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={!!progress.projects[labProject.id]?.[i]}
                onChange={(e) =>
                  setProgress((p) => ({
                    ...p,
                    projects: {
                      ...p.projects,
                      [labProject.id]: {
                        ...p.projects[labProject.id],
                        [i]: e.target.checked,
                      },
                    },
                  }))
                }
              />
              {req}
            </label>
          ))}
        </div>
      )}
      <CodeLab
        key={`${labLanguage}-${labProject?.id || "free"}`}
        language={labLanguage}
        initialCode={
          labProject?.starter ??
          (labLanguage === "React" ? reactStarter : jsStarter)
        }
        draftKey={
          labProject ? `project-${labProject.id}` : `lab-${labLanguage}`
        }
        drafts={progress.drafts}
        saveDraft={saveDraft}
        task={labProject?.task}
        guidance={!!labProject}
        onAssistance={() =>
          labProject && recordAssistance(`project-${labProject.id}`)
        }
        onResult={(result) =>
          labProject &&
          recordPractice(`project-${labProject.id}`, labProject.task, result)
        }
      />
      <div className="soft-note">
        <Lightbulb size={19} />
        <p>
          {labLanguage === "React"
            ? "Name your component App or export it as default. React is available as React, and imports from react are supported. Other packages and project files are outside this small playground."
            : "JavaScript runs separately from the page in a worker. Use console.log() to print a value. Page-changing APIs such as document and window are unavailable here. Long-running code stops automatically. Await asynchronous work so its errors can be reported."}
        </p>
      </div>
    </>
  );
}
