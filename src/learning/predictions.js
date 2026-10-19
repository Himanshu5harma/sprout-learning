function normalize(value) {
  const trimmed = value.replace(/\r\n/g, "\n").trim();
  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  }
}
export function predictionMatches(answer, expected) {
  return normalize(answer) === normalize(expected);
}
