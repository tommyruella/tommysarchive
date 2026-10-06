import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "public", "projects");
const outputFile = path.join(rootDir, "data", "scanned-stills.json");

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

function getImagesRecursively(dir, relPath = "") {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name.toLowerCase().startsWith("readme")) {
      continue;
    }

    const nextRel = relPath ? `${relPath}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getImagesRecursively(fullPath, nextRel));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push(nextRel);
      }
    }
  }

  return results;
}

export function syncStills(quiet = false) {
  if (!fs.existsSync(projectsDir)) {
    if (!quiet) console.log(`[sync-stills] Projects directory not found at ${projectsDir}. Preserving existing index.`);
    if (fs.existsSync(outputFile)) {
      try {
        return JSON.parse(fs.readFileSync(outputFile, "utf-8"));
      } catch (err) {
        return {};
      }
    }
    return {};
  }

  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
  const map = {};
  let totalImages = 0;

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const slug = entry.name;
    const projectFolder = path.join(projectsDir, slug);

    const relativeFiles = getImagesRecursively(projectFolder);
    relativeFiles.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    const urls = relativeFiles.map((rel) => {
      const encoded = rel
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
      return `/projects/${slug}/${encoded}`;
    });

    map[slug] = urls;
    totalImages += urls.length;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonString = JSON.stringify(map, null, 2) + "\n";
  const currentContent = fs.existsSync(outputFile)
    ? fs.readFileSync(outputFile, "utf-8")
    : null;

  if (currentContent !== jsonString) {
    fs.writeFileSync(outputFile, jsonString, "utf-8");
    if (!quiet) {
      console.log(
        `[sync-stills] Successfully indexed ${totalImages} images across ${
          Object.keys(map).length
        } projects -> ${path.relative(rootDir, outputFile)}`
      );
    }
  }

  return map;
}

let watcherInstance = null;
export function watchStills() {
  if (watcherInstance) return watcherInstance;
  if (!fs.existsSync(projectsDir)) return null;

  let debounceTimer = null;
  try {
    watcherInstance = fs.watch(
      projectsDir,
      { recursive: true },
      (eventType, filename) => {
        if (!filename || filename.startsWith(".")) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          syncStills(false);
        }, 150);
      }
    );
    console.log(`[sync-stills] Watching for project stills changes in ${projectsDir}`);
  } catch (err) {
    console.warn("[sync-stills] Could not start recursive filesystem watcher:", err.message);
  }

  return watcherInstance;
}

// CLI direct run
if (process.argv[1] === __filename) {
  syncStills(false);
}
