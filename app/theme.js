import { getSetting, saveSetting } from "./persistence/settings.js";

let systemQuery;
let manualPreference = false;

export function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const logo = theme === "dark"
    ? document.body.dataset.logoDark
    : document.body.dataset.logoLight;

  document.querySelectorAll("[data-brand-logo]").forEach((image) => {
    image.src = logo;
  });

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#0B1726" : "#1B365D";
}

export async function initializeTheme(defaultTheme = "system") {
  let saved = await getSetting("theme");
  if (saved !== "light" && saved !== "dark") {
    let legacy = null;
    try {
      legacy = window.localStorage.getItem("omniguard-demo-theme");
    } catch {
      legacy = null;
    }
    if (legacy === "light" || legacy === "dark") {
      saved = legacy;
      try {
        await saveSetting("theme", legacy);
      } catch {
        saved = null;
      }
    }
  }

  manualPreference = saved === "light" || saved === "dark";
  const theme = manualPreference ? saved : defaultTheme === "light" || defaultTheme === "dark"
    ? defaultTheme
    : getSystemTheme();
  applyTheme(theme);

  systemQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
  systemQuery?.addEventListener?.("change", () => {
    if (!manualPreference) applyTheme(getSystemTheme());
  });
  return theme;
}

export async function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  manualPreference = true;
  applyTheme(next);
  try {
    await saveSetting("theme", next);
    return { theme: next, persisted: true, error: null };
  } catch (error) {
    return { theme: next, persisted: false, error };
  }
}
