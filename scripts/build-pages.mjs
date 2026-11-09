import { readdir, readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "07_GITHUB");
const moduleRoots = ["app", "components", "pages"];
const entryModule = path.join(projectRoot, "scripts", "main.js");

function moduleOutputName(filePath) {
  const relative = path.relative(projectRoot, filePath).replaceAll(path.sep, "/");
  if (relative === "scripts/main.js") return "og-main.js";
  if (relative.startsWith("app/persistence/")) {
    return `og-persistence-${path.basename(relative, ".js")}.js`;
  }
  if (relative.startsWith("app/lms/")) {
    return `og-lms-${path.basename(relative, ".js")}.js`;
  }
  if (relative.startsWith("app/")) {
    const name = path.basename(relative, ".js");
    const aliases = { actions: "actions", data: "data", html: "html", learning: "learning", router: "router", state: "state", theme: "theme" };
    return `og-${aliases[name] || name}.js`;
  }
  if (relative.startsWith("components/")) {
    const aliases = { "bottom-sheet": "bottom-sheet", "lms-player": "lms-player", shell: "shell", sos: "sos", toast: "toast" };
    return `og-${aliases[path.basename(relative, ".js")]}.js`;
  }
  if (relative.startsWith("pages/")) {
    return `og-page-${path.basename(relative, ".js")}.js`;
  }
  throw new Error(`No hay alias de distribución para ${relative}`);
}

async function findModules(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findModules(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

function flattenImports(source, sourceFile, outputNames) {
  return source.replace(/((?:from|import)\s*)(["'])(\.{1,2}\/[^"']+)(["'])/g, (match, keyword, quote, specifier) => {
    const dependency = path.resolve(path.dirname(sourceFile), specifier);
    const outputName = outputNames.get(dependency);
    if (!outputName) throw new Error(`No se encontró módulo para ${specifier} en ${sourceFile}`);
    return `${keyword}${quote}./${outputName}${quote}`;
  });
}

async function copyJsonFiles() {
  const source = path.join(projectRoot, "assets", "data");
  const entries = await readdir(source, { withFileTypes: true });
  const outputs = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    await copyFile(path.join(source, entry.name), path.join(outputRoot, entry.name));
    outputs.push(entry.name);
  }
  return outputs;
}

async function copyResourceDirectory(sourceDirectory) {
  const entries = await readdir(sourceDirectory, { withFileTypes: true });
  const outputs = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name === "README.md") continue;
    const name = entry.name;
    await copyFile(path.join(sourceDirectory, name), path.join(outputRoot, name));
    outputs.push(name);
  }
  return outputs;
}

async function main() {
  await mkdir(outputRoot, { recursive: true });
  const moduleFiles = [
    ...(await Promise.all(moduleRoots.map((directory) => findModules(path.join(projectRoot, directory))))).flat(),
    entryModule
  ];
  const outputNames = new Map(moduleFiles.map((filePath) => [filePath, moduleOutputName(filePath)]));

  for (const sourceFile of moduleFiles) {
    const source = await readFile(sourceFile, "utf8");
    await writeFile(
      path.join(outputRoot, outputNames.get(sourceFile)),
      flattenImports(source, sourceFile, outputNames),
      "utf8"
    );
  }

  let html = await readFile(path.join(projectRoot, "index.html"), "utf8");
  html = html
    .replaceAll("./styles/tokens.css", "./tokens.css")
    .replaceAll("./styles/app.css", "./app.css")
    .replaceAll("./assets/icons/", "./")
    .replaceAll("./assets/images/logo-light-web.jpg", "./logo-light.jpg")
    .replaceAll("./assets/images/logo-dark-web.png", "./logo-dark.png")
    .replaceAll("./scripts/main.js", "./og-main.js")
    .replace('data-data-root="./assets/data/"', 'data-data-root="./"');
  await writeFile(path.join(outputRoot, "index.html"), html, "utf8");
  await copyFile(path.join(projectRoot, "styles", "tokens.css"), path.join(outputRoot, "tokens.css"));
  await copyFile(path.join(projectRoot, "styles", "app.css"), path.join(outputRoot, "app.css"));

  const manifest = JSON.parse(await readFile(path.join(projectRoot, "manifest.json"), "utf8"));
  manifest.icons = manifest.icons.map((icon) => ({
    ...icon,
    src: `./${path.basename(icon.src)}`
  }));
  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const dataFiles = await copyJsonFiles();
  const iconFiles = await copyResourceDirectory(path.join(projectRoot, "assets", "icons"));
  await copyFile(path.join(projectRoot, "assets", "images", "logo-light-web.jpg"), path.join(outputRoot, "logo-light.jpg"));
  await copyFile(path.join(projectRoot, "assets", "images", "logo-dark-web.png"), path.join(outputRoot, "logo-dark.png"));
  const courseImages = [
    "course-avsec.svg",
    "course-dangerous-goods.svg",
    "course-sms.svg"
  ];
  for (const image of courseImages) {
    await copyFile(
      path.join(projectRoot, "assets", "images", image),
      path.join(outputRoot, image)
    );
  }

  const staticFiles = [
    "index.html",
    "manifest.json",
    "tokens.css",
    "app.css",
    ...new Set(outputNames.values()),
    ...dataFiles,
    ...iconFiles,
    ...courseImages,
    "logo-light.jpg",
    "logo-dark.png"
  ];
  const worker = `const CACHE_NAME = "omniguard-pages-v11";
const STATIC_URLS = ${JSON.stringify(["./", ...staticFiles.map((name) => `./${name}`)], null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("omniguard-pages-") && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      return await fetch(request);
    } catch (error) {
      if (request.mode === "navigate") {
        const offlinePage = await caches.match(new URL("./index.html", self.registration.scope));
        if (offlinePage) return offlinePage;
      }
      throw error;
    }
  })());
});
`;
  await writeFile(path.join(outputRoot, "service-worker.js"), worker, "utf8");

  console.log(`Distribución plana actualizada: ${staticFiles.length} recursos estáticos, ${outputNames.size} módulos JavaScript.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
