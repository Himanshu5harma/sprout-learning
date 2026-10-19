export function explainError(
  message = "Something prevented the code from running.",
  name = "",
) {
  const details = String(message);
  if (/Too many re-renders|Maximum update depth/i.test(details))
    return {
      title: "An update keeps starting another render.",
      suggestion:
        "Do not call a state setter while rendering. Pass a function to the event handler instead of calling it immediately, and check whether an effect keeps changing one of its own dependencies.",
      details,
    };
  if (/form tried to navigate/i.test(details))
    return {
      title: "The form needs to stay on this page.",
      suggestion:
        "Call event.preventDefault() inside the form’s onSubmit handler, then update state. The preview prevented navigation so your current work remains available.",
      details,
    };
  if (/document is not defined|window is not defined/.test(details))
    return {
      title: "This console has no page to change.",
      suggestion:
        "JavaScript here runs in a worker: a separate place for calculations. Use the React preview for screen interactions, or follow the local-project instructions for browser DOM code.",
      details,
    };
  if (/not defined/.test(details))
    return {
      title: "JavaScript could not find that name.",
      suggestion:
        "Check the spelling and capital letters. If you meant text, put it inside quotation marks. If you meant a variable, declare it before using it.",
      details,
    };
  if (/constant variable|Assignment to constant/.test(details))
    return {
      title: "A const name cannot be given a different value.",
      suggestion:
        "Use let if this name must be reassigned. Changing a property inside an object is a separate operation.",
      details,
    };
  if (
    /Unexpected|SyntaxError|Unterminated|expected|Adjacent JSX/i.test(
      details,
    ) ||
    name === "SyntaxError"
  )
    return {
      title: "The code could not be read yet.",
      suggestion:
        "Check the reported line for a missing quote, parenthesis, brace, or closing JSX tag. Compare it with the working example one small part at a time.",
      details,
    };
  if (/not a function/.test(details))
    return {
      title: "This value cannot be called as a function.",
      suggestion:
        "Check the name just before the parentheses. It may contain text, a number, or an object instead of a function.",
      details,
    };
  if (/Cannot read properties|Cannot destructure/.test(details))
    return {
      title: "That value is missing or has a different shape.",
      suggestion:
        "Inspect the value before reading its property. Check empty arrays, missing objects, and the inputs passed to your function.",
      details,
    };
  if (/imports from react only|Unsupported import/.test(details))
    return {
      title: "This small preview does not include that package.",
      suggestion:
        "Imports from react are supported. Extra packages and local files need a full project. The lesson will label those steps separately.",
      details,
    };
  return {
    title: "The code stopped with an error.",
    suggestion:
      "Read the technical detail below, then check the inputs and the line it mentions. You can edit the code and run it again.",
    details,
  };
}
