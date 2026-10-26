// Behaviour checks share the learner's lexical scope. No source-string checks.
export function buildExecutionBody(code, checks = []) {
  const probes = checks
    .map((check, index) => {
      const expected = JSON.stringify(check.expected) ?? "undefined";
      const expression =
        check.kind === "output" ? "__sproutLines.slice()" : check.expression;
      const actual =
        check.kind === "log-call"
          ? `const __start = __sproutLines.length; await (${expression}); const __actual = __sproutLines.slice(__start);`
          : `const __actual = await (${expression});`;
      return `{
      try {
        ${actual}
        const __expected = ${expected};
        __sproutResults.push({ index: ${index}, label: ${JSON.stringify(check.label)}, passed: __sproutEqual(__actual, __expected), actual: __sproutDisplay(__actual), expected: __sproutDisplay(__expected), help: ${JSON.stringify(check.help || "Compare the input, returned value, and expected result. Change one part, then check again.")} });
      } catch (__error) {
        __sproutResults.push({ index: ${index}, label: ${JSON.stringify(check.label)}, passed: false, actual: __error.name + ': ' + __error.message, expected: __sproutDisplay(${expected}), help: ${JSON.stringify(check.help || "Check that the required function exists and handles this input.")} });
      }
    }`;
    })
    .join("\n");
  return `return (async () => {
    ${code}
    await __sproutIdle();
    const __sproutResults = [];
    ${probes}
    return __sproutResults;
  })();`;
}
