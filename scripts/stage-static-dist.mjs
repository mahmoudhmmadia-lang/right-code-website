import { cp, mkdir, rm, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const appRoot = resolve(process.cwd(), process.argv[2] ?? ".");
const source = join(appRoot, "dist");
const target = join(appRoot, "server", "dist");

try {
  const stats = await stat(source);
  if (!stats.isDirectory()) {
    throw new Error(`${source} is not a directory`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Cannot stage frontend build: ${message}`);
  process.exit(1);
}

await mkdir(join(appRoot, "server"), { recursive: true });
await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });

console.log(`Staged ${relative(process.cwd(), source)} -> ${relative(process.cwd(), target)}`);
