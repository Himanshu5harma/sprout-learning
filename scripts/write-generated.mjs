import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
// Rebuilding an identical asset must not reload an open learning/editor session.
export async function writeGenerated(path, contents) {
  const next = Buffer.from(contents);
  let current;
  try {
    current = await readFile(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (current?.equals(next)) return;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, next);
}
