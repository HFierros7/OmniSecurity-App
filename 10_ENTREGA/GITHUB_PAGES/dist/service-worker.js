const CACHE_NAME = "omniguard-pages-v11";
const STATIC_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./tokens.css",
  "./app.css",
  "./og-actions.js",
  "./og-data.js",
  "./og-html.js",
  "./og-learning.js",
  "./og-lms-actions.js",
  "./og-lms-assessment.js",
  "./og-lms-content.js",
  "./og-lms-study-tracker.js",
  "./og-persistence-bootstrap.js",
  "./og-persistence-courses.js",
  "./og-persistence-db.js",
  "./og-persistence-evaluations.js",
  "./og-persistence-evidences.js",
  "./og-persistence-ids.js",
  "./og-persistence-incidents.js",
  "./og-persistence-learning.js",
  "./og-persistence-logbook.js",
  "./og-persistence-navigation.js",
  "./og-persistence-progress.js",
  "./og-persistence-settings.js",
  "./og-persistence-sos.js",
  "./og-persistence-users.js",
  "./og-router.js",
  "./og-state.js",
  "./og-theme.js",
  "./og-bottom-sheet.js",
  "./og-lms-player.js",
  "./og-shell.js",
  "./og-sos.js",
  "./og-toast.js",
  "./og-page-academy.js",
  "./og-page-activity.js",
  "./og-page-course.js",
  "./og-page-exam.js",
  "./og-page-flashcards.js",
  "./og-page-home.js",
  "./og-page-lesson.js",
  "./og-page-login.js",
  "./og-page-operations.js",
  "./og-page-profile.js",
  "./og-page-quiz.js",
  "./og-page-results.js",
  "./og-page-unit.js",
  "./og-main.js",
  "./avsec-course.json",
  "./avsec-question-bank.json",
  "./cliente.json",
  "./configuracion.json",
  "./consignas.json",
  "./cursos.json",
  "./demo-data.json",
  "./empresa.json",
  "./evaluaciones.json",
  "./incidentes.json",
  "./inventario.json",
  "./lecciones.json",
  "./lms-demo.json",
  "./unidades.json",
  "./usuario.json",
  "./apple-touch-icon.png",
  "./favicon-32x32.png",
  "./favicon-48x48.png",
  "./favicon.ico",
  "./icon-128x128.png",
  "./icon-144x144.png",
  "./icon-152x152.png",
  "./icon-180x180.png",
  "./icon-192x192.png",
  "./icon-384x384.png",
  "./icon-512x512.png",
  "./icon-72x72.png",
  "./icon-96x96.png",
  "./maskable-icon-512x512.png",
  "./splash-dark-1024.png",
  "./splash-light-1024.png",
  "./course-avsec.svg",
  "./course-dangerous-goods.svg",
  "./course-sms.svg",
  "./logo-light.jpg",
  "./logo-dark.png"
];

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
