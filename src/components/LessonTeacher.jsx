import { codeFingerprint } from "../learning/progress.js";
import { useId, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Leaf,
  Lightbulb,
  X,
} from "lucide-react";
import CodeLab, { CodeBlock } from "./CodeLab.jsx";
import { allLessons } from "../curriculum.js";
import { practiceEvidence, taskIsCurrent } from "../learning/progress.js";
import { useDraft } from "../persistence/store";
import { predictionMatches } from "../learning/predictions.js";

export function RichText({ children = "" }) {
  return String(children)
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith("`") && part.endsWith("`") ? (
        <code className="inline-code" key={index}>
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      ),
    );
}

function ExpectedResult({ expected }) {
  return (
    <section className="expected-result">
      <h3>
        Expected{" "}
        {expected.kind === "console" ? "console output" : "screen behaviour"}
      </h3>
      {expected.kind === "console" ? (
        <>
          <pre>{expected.lines.join("\n")}</pre>
          <p>
            This is reference output. Run the example in Practice to produce
            your own result.
          </p>
        </>
      ) : (
        <p>{expected.description}</p>
      )}
    </section>
  );
}

function PracticeTask({
  task,
  lesson,
  progress,
  saveDraft,
  onResult,
  onAssistance,
}) {
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const key = `exercise-${lesson.id}-${task.id}`;
  const record = progress.practice[key];
  const current = taskIsCurrent(
    record,
    task,
    progress.drafts[key] ?? task.starter,
  );
  return (
    <div className="practice-task">
      <div className="task-heading">
        <div className="eyebrow">
          {task.id === "independent"
            ? "INDEPENDENT EXERCISE"
            : "GUIDED PRACTICE"}
        </div>
        <h2>{task.goal}</h2>
        {current && (
          <span className="evidence-badge">
            <CheckCircle2 size={15} />
            Behaviour checked{record.assisted ? " · solution viewed" : ""}
          </span>
        )}
      </div>
      <dl className="task-brief">
        <div>
          <dt>Start with</dt>
          <dd>
            <RichText>{task.starting}</RichText>
          </dd>
        </div>
        <div>
          <dt>Your task</dt>
          <dd>
            <RichText>{task.instructions}</RichText>
          </dd>
        </div>
        <div>
          <dt>Success looks like</dt>
          <dd className="task-expected">{task.expected}</dd>
        </div>
        <div>
          <dt>Keep in mind</dt>
          <dd>
            <RichText>{task.constraints}</RichText>
          </dd>
        </div>
      </dl>
      <CodeLab
        initialCode={task.starter}
        language={lesson.category}
        draftKey={key}
        drafts={progress.drafts}
        saveDraft={saveDraft}
        task={task}
        onResult={(result) => {
          if (showSolution) onAssistance(key);
          onResult(key, task, result);
        }}
        compact
      />
      <div className="learning-support">
        <div className="hint-controls">
          <button
            className="text-button"
            disabled={hints >= task.hints.length}
            onClick={() => setHints((count) => count + 1)}
          >
            <Lightbulb size={16} />
            {hints === 0
              ? "Show a conceptual hint"
              : hints < task.hints.length
                ? "Show a more specific hint"
                : "All hints shown"}
          </button>
          <button
            className="text-button"
            onClick={() => {
              if (!showSolution) onAssistance(key);
              setShowSolution(!showSolution);
            }}
          >
            {showSolution ? "Hide solution" : "Show explained solution"}
          </button>
        </div>
        {task.hints.slice(0, hints).map((hint, index) => (
          <p className="learning-hint" key={index}>
            <strong>Hint {index + 1}.</strong> <RichText>{hint}</RichText>
          </p>
        ))}
        {showSolution && (
          <div className="explained-solution">
            <p className="assistance-note">
              A solution is a learning aid. If these checks pass afterward, the
              result is labeled “solution viewed”; it is not evidence of an
              unaided attempt.
            </p>
            <CodeBlock
              code={task.solution}
              language={lesson.category}
              label="Explained solution"
            />
            <h3>Why this works</h3>
            <p>
              <RichText>{task.explanation}</RichText>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Prediction({ lesson, progress, onSave }) {
  const prediction = lesson.teaching.prediction;
  const saved = progress.predictions[lesson.id] || {};
  const answer = saved.answer || "";
  const checked = !!saved.checked;
  const passed = predictionMatches(answer, prediction.expected);
  const label = useId();
  return (
    <section className="prediction-task">
      <div className="eyebrow">READ THE CODE BEFORE EXECUTING IT</div>
      <h2>Predict the result</h2>
      <p>{prediction.question}</p>
      <CodeBlock
        code={prediction.code}
        language={lesson.category}
        label="Code to predict"
      />
      <label className="field-label" htmlFor={label}>
        Your prediction
      </label>
      <textarea
        id={label}
        className="prediction-input text-input"
        rows={3}
        value={answer}
        placeholder="Write the expected result here"
        onChange={(event) => {
          onSave(lesson.id, {
            answer: event.target.value,
            checked: false,
            passed: false,
          });
        }}
      />
      <button
        className="primary-button"
        disabled={!answer.trim()}
        onClick={() => {
          onSave(lesson.id, { answer, checked: true, passed });
        }}
      >
        Check my prediction
        <ArrowRight size={16} />
      </button>
      {checked && (
        <div
          className={`prediction-feedback ${passed ? "correct" : "mismatch"}`}
          role="status"
        >
          <h3>
            {passed
              ? "Your prediction matches."
              : "Compare the steps with the expected result."}
          </h3>
          {!passed && (
            <div className="result-comparison">
              <div>
                <span>You predicted</span>
                <pre>{answer}</pre>
              </div>
              <div>
                <span>Expected</span>
                <pre>{prediction.expected}</pre>
              </div>
            </div>
          )}
          <p>{prediction.explanation}</p>
        </div>
      )}
    </section>
  );
}

function LocalProject({ project, language }) {
  return (
    <details className="local-project">
      <summary>
        Full local project step · not executed by this playground
      </summary>
      <h3>{project.title}</h3>
      <ol>
        {project.steps.map((step, index) => (
          <li key={index}>
            <RichText>{step}</RichText>
          </li>
        ))}
      </ol>
      {project.files.map((file) => (
        <div key={file.name}>
          <h4>{file.name}</h4>
          <CodeBlock
            code={file.code}
            language={language}
            label={`Local file ${file.name}`}
          />
        </div>
      ))}
      <p className="local-result">
        <strong>Expected locally:</strong> {project.expected}
      </p>
    </details>
  );
}

export default function LessonTeacher({
  lesson,
  progress: progressSnapshot,
  saveDraft,
  onResult,
  onAssistance,
  onReflection,
  onPrediction,
  onKnowledge,
  onOpenLesson,
  onProject,
  onClose,
  onBookmark,
  onComplete,
}) {
  const independentKey = `exercise-${lesson.id}-independent`;
  const currentDraft = useDraft(independentKey);
  const progress = {
    ...progressSnapshot,
    drafts: {
      ...progressSnapshot.drafts,
      [independentKey]: currentDraft ?? lesson.teaching.independent.starter,
    },
  };

  const [tab, setTab] = useState("Learn");
  const [stage, setStage] = useState(5);
  const [warmupsOpen, setWarmupsOpen] = useState(false);
  const [line, setLine] = useState(null);
  const savedQuiz =
    progress.knowledge?.[lesson.id]?.revision === 2 &&
    progress.knowledge[lesson.id]?.signature ===
      codeFingerprint(JSON.stringify(lesson.quiz))
      ? progress.knowledge[lesson.id]
      : null;
  const answer = savedQuiz?.answer ?? null;
  const checked = !!savedQuiz?.checked;
  const teaching = lesson.teaching;
  const verified = practiceEvidence(progress, lesson);
  const quizPassed = checked && answer === lesson.quiz.answer;
  const tasks = teaching.tasks;
  const stages = [
    "Run example",
    "Predict",
    "Change",
    "Fill the gap",
    "Fix a mistake",
    "Build yourself",
  ];
  const panelId = `lesson-${lesson.id}`;
  const reflectionId = useId();
  const currentTask = stage === 5 ? teaching.independent : tasks[stage - 2];
  function selectTab(next) {
    setTab(next);
  }
  function tabKeys(event) {
    const tabs = ["Learn", "Practice", "Quick check"];
    let index = tabs.indexOf(tab);
    if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[index]);
    event.currentTarget.querySelectorAll("button")[index].focus();
  }
  return (
    <>
      <div className="lesson-dialog-header">
        <button className="text-button" onClick={onClose}>
          <ArrowLeft size={16} />
          Back to your path
        </button>
        <div>
          <button
            className={`icon-button ${progress.bookmarks.includes(lesson.id) ? "is-saved" : ""}`}
            aria-label={
              progress.bookmarks.includes(lesson.id)
                ? "Remove bookmark"
                : "Bookmark lesson"
            }
            onClick={onBookmark}
          >
            <Bookmark
              size={19}
              fill={
                progress.bookmarks.includes(lesson.id) ? "currentColor" : "none"
              }
            />
          </button>
          <button
            className="icon-button"
            aria-label="Close lesson"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
      </div>
      <div className="lesson-body teacher-body">
        <div className="eyebrow">
          {lesson.courseTitle} · ONE CONCEPT, ONE PRACTICAL TASK
        </div>
        <h1>{lesson.title}</h1>
        {progress.completed.includes(lesson.id) && !verified && (
          <p className="legacy-completion">
            <CheckCircle2 size={16} />
            Your earlier completion is preserved. Current practical evidence
            needs rechecking.
          </p>
        )}
        <div
          className="lesson-tabs"
          role="tablist"
          aria-label="Lesson sections"
          onKeyDown={tabKeys}
        >
          {["Learn", "Practice", "Quick check"].map((name, index) => (
            <button
              key={name}
              role="tab"
              id={`${panelId}-${index}-tab`}
              aria-controls={`${panelId}-panel`}
              aria-selected={tab === name}
              tabIndex={tab === name ? 0 : -1}
              onClick={() => selectTab(name)}
            >
              <span>{index + 1}</span>
              {name}
              {name === "Practice" && verified && <CheckCircle2 size={14} />}
              {name === "Quick check" && quizPassed && (
                <CheckCircle2 size={14} />
              )}
            </button>
          ))}
        </div>
        <div
          id={`${panelId}-panel`}
          role="tabpanel"
          aria-labelledby={`${panelId}-${["Learn", "Practice", "Quick check"].indexOf(tab)}-tab`}
        >
          {tab === "Learn" && (
            <>
              <section className="lesson-goal">
                <span>
                  <Leaf size={21} />
                </span>
                <div>
                  <h2>What you will be able to do</h2>
                  <p>{teaching.goal}</p>
                </div>
              </section>
              <details className="lesson-prerequisites compact-prerequisites">
                <summary>What to know first</summary>
                {teaching.prerequisites.length ? (
                  <div>
                    {teaching.prerequisites.map((id) => {
                      const item = allLessons.find(
                        (candidate) => candidate.id === id,
                      );
                      return (
                        <button
                          className="prerequisite-link"
                          key={id}
                          onClick={() => onOpenLesson(item)}
                        >
                          {item.title}
                          {progress.completed.includes(id) && (
                            <CheckCircle2 size={12} />
                          )}
                          <ArrowRight size={12} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p>
                    No programming knowledge is needed. Start by learning where
                    to type code and where its result appears.
                  </p>
                )}
              </details>
              <div className="lesson-read teacher-read">
                <div className="lesson-plain">
                  <h3>The idea</h3>
                  <p>
                    <RichText>{teaching.brief}</RichText>
                  </p>
                  <div className="lesson-short-actions">
                    <button
                      className="primary-button"
                      onClick={() => {
                        setStage(5);
                        setWarmupsOpen(false);
                        selectTab("Practice");
                      }}
                    >
                      Try the task <ArrowRight size={16} />
                    </button>
                    <button
                      className="text-button"
                      onClick={() => {
                        setStage(0);
                        setWarmupsOpen(true);
                        selectTab("Practice");
                      }}
                    >
                      Run this example
                    </button>
                  </div>
                  <details className="lesson-deeper">
                    <summary>Need more explanation?</summary>
                    <h3>Why this is useful</h3>
                    <p>{teaching.why}</p>
                    {teaching.explanation.map((paragraph, index) => (
                      <p key={index}>
                        <RichText>{paragraph}</RichText>
                      </p>
                    ))}
                    <section className="common-mistake">
                      <h3>
                        <Lightbulb size={18} />A common mistake
                      </h3>
                      <p>
                        <RichText>{teaching.mistake.explanation}</RichText>
                      </p>
                      <p>
                        <strong>Fix:</strong>{" "}
                        <RichText>{teaching.mistake.fix}</RichText>
                      </p>
                    </section>
                    <h3>Recap</h3>
                    <ul>
                      {teaching.recap.map((item) => (
                        <li key={item}>
                          <RichText>{item}</RichText>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                <div className="example-and-explanation">
                  <CodeBlock
                    code={lesson.code}
                    language={lesson.category}
                    label="Minimal working example"
                    discussedLine={line}
                  />
                  <ExpectedResult expected={teaching.expected} />
                  <details className="line-explanations lesson-code-help">
                    <summary>Explain the code, line by line</summary>
                    <p className="line-help">
                      Choose an explanation to mark its line in Code.
                    </p>
                    {teaching.walkthrough.map((item) => (
                      <button
                        key={item.from}
                        className={`line-explanation ${line === item.from ? "selected" : ""}`}
                        aria-pressed={line === item.from}
                        onClick={() => setLine(item.from)}
                      >
                        <span>
                          Line{item.from === item.to ? "" : "s"} {item.from}
                          {item.from !== item.to ? `–${item.to}` : ""}
                        </span>
                        <p>
                          <RichText>{item.explanation}</RichText>
                        </p>
                      </button>
                    ))}
                  </details>
                </div>
              </div>
              {teaching.localProject && (
                <LocalProject
                  project={teaching.localProject}
                  language={lesson.category}
                />
              )}
              <details className="project-connection compact-project-link">
                <summary>Use it in a project</summary>
                <p>{teaching.connection}</p>
                <button
                  className="text-button"
                  onClick={() => onProject(teaching.project)}
                >
                  Open the connected project
                  <ArrowRight size={15} />
                </button>
              </details>
            </>
          )}
          {tab === "Practice" && (
            <>
              {stage !== 5 && (
                <button
                  className="text-button return-to-task"
                  onClick={() => {
                    setStage(5);
                    setWarmupsOpen(false);
                  }}
                >
                  Go straight to the task <ArrowRight size={15} />
                </button>
              )}
              <details
                className="optional-warmups"
                open={warmupsOpen}
                onToggle={(event) => setWarmupsOpen(event.currentTarget.open)}
              >
                <summary>Optional warm-up exercises</summary>
                <div
                  className="practice-stages"
                  aria-label="Optional practice exercises"
                >
                  {stages.map((name, index) => (
                    <button
                      key={name}
                      aria-current={stage === index ? "step" : undefined}
                      className={stage === index ? "current" : ""}
                      onClick={() => setStage(index)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </details>
              {stage === 0 && (
                <section className="run-example-task">
                  <h2>Run a working example</h2>
                  <p>
                    Press Run code. Compare the actual result with the expected
                    result below. Try the task when you are ready.
                  </p>
                  <CodeLab
                    key={`example-${lesson.id}`}
                    initialCode={lesson.code}
                    language={lesson.category}
                    draftKey={`lesson-${lesson.id}`}
                    drafts={progress.drafts}
                    saveDraft={saveDraft}
                    compact
                  />
                  <ExpectedResult expected={teaching.expected} />
                  <p className="draft-note">
                    If an earlier saved example differs from this lesson’s
                    current example, your draft is kept. Reset code replaces it
                    only when you choose that action.
                  </p>
                </section>
              )}
              {stage === 1 && (
                <Prediction
                  key={lesson.id}
                  lesson={lesson}
                  progress={progress}
                  onSave={onPrediction}
                />
              )}
              {stage >= 2 && (
                <PracticeTask
                  key={`${lesson.id}-${stage}`}
                  task={currentTask}
                  lesson={lesson}
                  progress={progress}
                  saveDraft={saveDraft}
                  onResult={onResult}
                  onAssistance={onAssistance}
                />
              )}
              {stage === 5 && (
                <details className="own-words optional-reflection">
                  <summary>Optional: explain your solution</summary>
                  <p>
                    How does your solution reach its result? Explain one input,
                    one important line, and one mistake you now know how to fix.
                    This note is saved for you; it is not automatically graded.
                  </p>
                  <label className="sr-only" htmlFor={reflectionId}>
                    Your explanation of this lesson
                  </label>
                  <textarea
                    id={reflectionId}
                    className="text-input"
                    rows={4}
                    value={progress.reflections[lesson.id] || ""}
                    onChange={(event) =>
                      onReflection(lesson.id, event.target.value)
                    }
                    placeholder="I start with… This line… If I changed…"
                  />
                </details>
              )}
              <div className="practice-step-navigation">
                {stage !== 5 && (
                  <button
                    className="text-button"
                    disabled={stage === 0}
                    onClick={() => setStage((value) => value - 1)}
                  >
                    <ArrowLeft size={15} />
                    Previous stage
                  </button>
                )}
                <button
                  className="text-button"
                  onClick={() =>
                    stage < 5
                      ? setStage((value) => value + 1)
                      : setTab("Quick check")
                  }
                >
                  {stage < 5 ? "Next stage" : "Continue to quick check"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
          {tab === "Quick check" && (
            <>
              <div className="quiz teacher-quiz">
                <div className="eyebrow">
                  A KNOWLEDGE CHECK, SEPARATE FROM PRACTICAL EVIDENCE
                </div>
                <h2>{lesson.quiz.question}</h2>
                <fieldset>
                  <legend className="sr-only">Choose an answer</legend>
                  {lesson.quiz.options.map((option, index) => (
                    <label
                      key={index}
                      className={`quiz-option ${answer === index ? "chosen" : ""} ${checked && answer === index ? (index === lesson.quiz.answer ? "correct" : "incorrect") : ""}`}
                    >
                      <input
                        type="radio"
                        name={`answer-${lesson.id}`}
                        checked={answer === index}
                        onChange={() => {
                          onKnowledge(lesson.id, {
                            answer: index,
                            checked: false,
                            passed: false,
                          });
                        }}
                      />
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <RichText>{option}</RichText>
                    </label>
                  ))}
                </fieldset>
                <button
                  className="primary-button"
                  disabled={answer === null}
                  onClick={() => {
                    onKnowledge(lesson.id, {
                      answer,
                      checked: true,
                      passed: answer === lesson.quiz.answer,
                    });
                  }}
                >
                  Check my answer
                  <ArrowRight size={16} />
                </button>
                {checked && (
                  <div
                    className={`quiz-feedback ${quizPassed ? "success" : "retry"}`}
                    role="status"
                  >
                    <strong>
                      {quizPassed
                        ? "This answer matches the concept."
                        : `You chose “${lesson.quiz.options[answer]}”. Here is the distinction.`}
                    </strong>
                    <p>{lesson.quiz.explanation}</p>
                    {!quizPassed && (
                      <p>
                        Trace the relevant line in Learn, then select another
                        answer.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <section className="completion-evidence">
                <h3>Before completing this lesson</h3>
                <p>
                  <strong>
                    {verified ? "✓" : "○"} Independent behaviour check:
                  </strong>{" "}
                  {verified
                    ? "The current saved solution passes its listed cases."
                    : "Not verified for the current code."}
                </p>
                <p>
                  <strong>{quizPassed ? "✓" : "○"} Knowledge check:</strong>{" "}
                  {quizPassed
                    ? "Answered correctly."
                    : "Choose and check an answer above."}
                </p>
                {!verified && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setTab("Practice");
                      setStage(5);
                    }}
                  >
                    Open the independent exercise
                    <ArrowRight size={15} />
                  </button>
                )}
                <p className="check-scope">
                  Completion records this practical check and knowledge answer.
                  It is not a certificate of mastery. Self-explanation and
                  project practice help you go further.
                </p>
              </section>
            </>
          )}
        </div>
        <div className="lesson-bottom">
          <span>
            <CheckCircle2 size={16} />
            {verified
              ? "Current exercise behaviour checked"
              : "Practical understanding takes more than a quiz"}
          </span>
          {tab === "Learn" ? (
            <button
              className="primary-button"
              onClick={() => setTab("Practice")}
            >
              Practise step by step
              <ArrowRight size={16} />
            </button>
          ) : tab === "Practice" ? (
            <button
              className="primary-button"
              onClick={() => setTab("Quick check")}
            >
              Review what you know
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={!quizPassed || !verified}
              onClick={() => onComplete(true)}
            >
              {progress.completed.includes(lesson.id)
                ? "Next lesson"
                : "Complete lesson"}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
