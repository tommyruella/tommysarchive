import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "data", "scanned-stills.json");

// Helper to load .env.local if present
function loadEnv() {
  const envPath = path.join(rootDir, ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME || "stills";

if (!supabaseUrl || !supabaseKey) {
  console.log(`
[sync-supabase] Missing credentials in .env.local!
Please ensure you have:
  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
  SUPABASE_BUCKET_NAME=stills  (optional, defaults to "stills")
`);
  process.exit(1);
}

const cleanBaseUrl = supabaseUrl.replace(/\/+$/, "");

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

async function listFolder(prefix = "") {
  const endpoint = `${cleanBaseUrl}/storage/v1/object/list/${bucketName}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      prefix,
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list storage path "${prefix}": ${response.status} ${errorText}`);
  }

  return response.json();
}

async function scanFolderRecursively(prefix, slug) {
  let images = [];
  const items = await listFolder(prefix);

  for (const item of items) {
    const fullItemPath = prefix ? `${prefix}/${item.name}` : item.name;
    // In Supabase Storage, folders have id === null
    if (item.id === null) {
      const nested = await scanFolderRecursively(fullItemPath, slug);
      images = images.concat(nested);
    } else {
      const ext = path.extname(item.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        // Build relative project path: /projects/<slug>/<rest-of-path>
        const relativeToSlug = fullItemPath.startsWith(`${slug}/`)
          ? fullItemPath.slice(slug.length + 1)
          : fullItemPath;
        
        const encoded = relativeToSlug
          .split("/")
          .map((part) => encodeURIComponent(part))
          .join("/");
        images.push(`/projects/${slug}/${encoded}`);
      }
    }
  }

  return images;
}

export async function syncFromSupabase() {
  console.log(`[sync-supabase] Fetching folders from bucket "${bucketName}"...`);
  
  // List top-level folders (project slugs)
  const rootItems = await listFolder("");
  const projectFolders = rootItems.filter((item) => item.id === null);

  if (projectFolders.length === 0) {
    console.warn(`[sync-supabase] No project folders found in bucket "${bucketName}".`);
    return {};
  }

  const map = {};
  let totalImages = 0;

  for (const folder of projectFolders) {
    const slug = folder.name;
    console.log(`[sync-supabase] Scanning project "${slug}"...`);
    const images = await scanFolderRecursively(slug, slug);
    images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    map[slug] = images;
    totalImages += images.length;
  }

  const jsonString = JSON.stringify(map, null, 2) + "\n";
  fs.writeFileSync(outputFile, jsonString, "utf-8");
  console.log(`[sync-supabase] Successfully indexed ${totalImages} images across ${Object.keys(map).length} projects -> ${path.relative(rootDir, outputFile)}`);
  return map;
}

syncFromSupabase().catch((err) => {
  console.error(`[sync-supabase] Error:`, err.message);
  process.exit(1);
});
