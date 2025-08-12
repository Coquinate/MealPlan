import { cp, mkdir, readdir, stat, rm } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import chokidar from "chokidar";
import fg from "fast-glob";

const ROOT = process.cwd();
const OUT = path.join(ROOT, ".history"); // backup folder
const RETENTION_DAYS = 7; // delete backups older than this

// Patterns to include
const GLOB = [
  "src/**/*.{ts,tsx,js,jsx,json,css,scss,html,md}",
  "app/**/*.{ts,tsx,js,jsx,json,css,scss,html,md}",
  "*.json",
  "*.md"
];

// Patterns to exclude
const IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/.history/**"
];

function stamp(d = new Date()) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

async function backup(filePath) {
  const rel = path.relative(ROOT, filePath);
  const dir = path.dirname(rel);
  const base = path.basename(rel);
  const targetDir = path.join(OUT, dir);

  if (!existsSync(filePath)) return;

  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  const target = path.join(targetDir, `${stamp()}__${base}`);
  await cp(filePath, target);
  console.log("[backup]", rel, "→", path.relative(ROOT, target));
}

async function purgeOldBackups() {
  console.log(`🧹 Purging backups older than ${RETENTION_DAYS} days...`);
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  async function recurse(dir) {
    const items = await readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        await recurse(fullPath);
        continue;
      }
      const info = await stat(fullPath);
      if (info.mtimeMs < cutoff) {
        await rm(fullPath);
        console.log("[purged]", path.relative(ROOT, fullPath));
      }
    }
  }

  if (existsSync(OUT)) {
    await recurse(OUT);
  }
  console.log("✅ Purge complete");
}

async function initialBaseline() {
  console.log("📂 Creating baseline backup...");
  const files = await fg(GLOB, { ignore: IGNORE, cwd: ROOT, absolute: true });
  for (const file of files) {
    await backup(file);
  }
  console.log(`✅ Baseline backup complete: ${files.length} files`);
}

// Main watcher
(async () => {
  await purgeOldBackups();
  await initialBaseline();

  const watcher = chokidar.watch(GLOB, {
    ignored: IGNORE,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
  });

  watcher
    .on("change", backup)
    .on("add", backup)
    .on("unlink", async (filePath) => {
      console.log("[delete detected]", path.relative(ROOT, filePath));
      if (existsSync(filePath)) {
        await backup(filePath);
      }
    });

  console.log("👀 Watching for changes, deletions, and purging old backups...");
})();
