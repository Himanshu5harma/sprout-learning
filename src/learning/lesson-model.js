export const REVISION = 2;
export const outputCheck = (
  values,
  help = "Compare each printed line with the expected output, including order and spelling.",
) => [
  {
    kind: "output",
    label: "Console output",
    expected: values.map(formatValue),
    help,
  },
];
export const valueCheck = (label, expression, expected, help) => ({
  label,
  expression,
  expected,
  help,
});
export const text = (value) => ({ action: "text", value });
export const click = (name) => ({ action: "click", name });
export const fill = (label, value) => ({ action: "fill", label, value });
export const uiCheck = (label, ...steps) => ({ label, steps });
export function formatValue(value) {
  return typeof value === "string"
    ? value
    : (JSON.stringify(value, null, 2) ?? String(value));
}

function replacement(code, change, description) {
  if (!change?.find || !code.includes(change.find))
    throw new Error(`Invalid ${description}: ${change?.find}`);
  return code.replace(change.find, change.with);
}

// Only the progression is shared. Goals, examples, hints, mistakes, and checks
// are authored per concept in the content files.
export function prepareTeaching(spec, category) {
  const guide = spec.guided;
  const guidedChecks = guide.checks || outputCheck(guide.output);
  const baseTask = {
    revision: REVISION,
    language: category,
    goal: guide.goal,
    starting: guide.starting,
    expected: guide.expected || guide.output.map(formatValue).join("\n"),
    constraints:
      guide.constraints ||
      "Use the syntax explained in this lesson and its prerequisites. Different correct implementations are welcome.",
    checks: guidedChecks,
    solution: guide.solution,
    hints: guide.hints,
    explanation: guide.explanation,
  };
  const independent = {
    revision: REVISION,
    ...spec.independent,
    language: category,
  };
  return {
    ...spec,
    walkthrough: spec.walkthrough.map(([from, to, explanation]) => ({
      from,
      to,
      explanation,
    })),
    expected:
      category === "React"
        ? { kind: "screen", description: spec.visible }
        : { kind: "console", lines: spec.output.map(formatValue) },
    prediction: {
      ...spec.prediction,
      expected: spec.prediction.answer.map(formatValue).join("\n"),
    },
    tasks: [
      {
        ...baseTask,
        id: "modify",
        title: "Change one part",
        starter: guide.starter,
        instructions: guide.change,
      },
      {
        ...baseTask,
        id: "fill",
        title: "Fill the gap",
        starter: replacement(guide.solution, guide.gap, `${spec.id} gap`),
        instructions: guide.gap.instructions,
      },
      {
        ...baseTask,
        id: "debug",
        title: "Fix a mistake",
        starter: replacement(guide.solution, guide.bug, `${spec.id} mistake`),
        instructions: guide.bug.instructions,
      },
    ],
    independent: {
      ...independent,
      id: "independent",
      title: "Build it yourself",
    },
    mistake: { explanation: guide.bug.why, fix: guide.bug.fix },
  };
}
