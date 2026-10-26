export async function compileReact(code) {
  const Babel = await import("@babel/standalone");
  return Babel.transform(code, {
    presets: [["react", { runtime: "classic" }]],
    // Enforcement lives in the VM and terminable worker, including dynamic code.
    plugins: ["transform-modules-commonjs"],
    filename: "App.jsx",
    sourceType: "module",
  }).code;
}
