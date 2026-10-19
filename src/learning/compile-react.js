export function loopGuard({ types: t }) {
  return {
    visitor: {
      "WhileStatement|DoWhileStatement|ForStatement|ForInStatement|ForOfStatement"(
        path,
      ) {
        const body = path.get("body");
        if (!body.isBlockStatement())
          body.replaceWith(t.blockStatement([body.node]));
        body.unshiftContainer(
          "body",
          t.ifStatement(
            t.binaryExpression(
              ">",
              t.updateExpression(
                "++",
                t.memberExpression(
                  t.identifier("window"),
                  t.identifier("__sproutSteps"),
                ),
              ),
              t.numericLiteral(100000),
            ),
            t.throwStatement(
              t.newExpression(t.identifier("Error"), [
                t.stringLiteral(
                  "The loop ran too many times. Check that its condition can become false and its counter changes.",
                ),
              ]),
            ),
          ),
        );
      },
    },
  };
}

export async function compileReact(code) {
  const Babel = await import("@babel/standalone");
  return Babel.transform(code, {
    presets: [["react", { runtime: "classic" }]],
    plugins: [loopGuard, "transform-modules-commonjs"],
    filename: "App.jsx",
    sourceType: "module",
  }).code;
}
