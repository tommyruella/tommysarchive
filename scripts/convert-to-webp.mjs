import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { syncStills } from "./sync-stills.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "public", "projects");

const CONVERT_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
]);

function getConvertibleFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getConvertibleFiles(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (CONVERT_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function convertAllToWebP() {
  console.log(`\n======================================================`);
  console.log(`[convert-to-webp] Scanning for images in: ${projectsDir}`);
  console.log(`======================================================\n`);

  const files = getConvertibleFiles(projectsDir);

  if (files.length === 0) {
    console.log(`[convert-to-webp] No PNG/JPG images found. Everything is already WebP or converted!`);
    syncStills(false);
    return;
  }

  console.log(`Found ${files.length} images to convert...\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = path.extname(file);
    const targetFile = file.slice(0, -ext.length) + ".webp";
    const relFile = path.relative(projectsDir, file);
    const relTarget = path.relative(projectsDir, targetFile);

    try {
      const beforeStat = fs.statSync(file);
      const beforeSize = beforeStat.size;
      totalBefore += beforeSize;

      // Convert using sharp:
      // - Max width 2560px for razor-sharp Retina/4K without oversized camera raws
      // - WebP quality 82 (lossless-like photographic fidelity, tiny file size)
      await sharp(file)
        .resize({ width: 2560, withoutEnlargement: true, fit: "inside" })
        .webp({ quality: 82, effort: 4 })
        .toFile(targetFile);

      const afterStat = fs.statSync(targetFile);
      const afterSize = afterStat.size;
      totalAfter += afterSize;

      // Remove the original uncompressed file
      fs.unlinkSync(file);

      const saved = ((1 - afterSize / beforeSize) * 100).toFixed(1);
      console.log(
        `[${i + 1}/${files.length}] ${relFile} (${formatBytes(beforeSize)}) -> ${relTarget} (${formatBytes(afterSize)}) [-${saved}%]`
      );
      successCount++;
    } catch (err) {
      console.error(`[convert-to-webp] Failed to convert ${relFile}:`, err.message);
      failCount++;
    }
  }

  const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

  console.log(`\n======================================================`);
  console.log(`[convert-to-webp] Conversion complete!`);
  console.log(`  - Converted: ${successCount} files (Failed: ${failCount})`);
  console.log(`  - Size before: ${formatBytes(totalBefore)}`);
  console.log(`  - Size after:  ${formatBytes(totalAfter)}`);
  console.log(`  - Space saved: ${formatBytes(totalBefore - totalAfter)} (-${totalSaved}%)`);
  console.log(`======================================================\n`);

  // Update scanned-stills.json index
  syncStills(false);
}

// Run CLI
if (process.argv[1] === __filename) {
  convertAllToWebP().catch((err) => {
    console.error(`[convert-to-webp] Error:`, err);
    process.exit(1);
  });
}
