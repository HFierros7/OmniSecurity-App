const CACHE_NAME = "omniguard-static-v11";
const STATIC_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles/tokens.css",
  "./styles/app.css",
  "./scripts/main.js",
  "./app/actions.js",
  "./app/data.js",
  "./app/html.js",
  "./app/learning.js",
  "./app/lms/actions.js",
  "./app/lms/assessment.js",
  "./app/lms/content.js",
  "./app/lms/study-tracker.js",
  "./app/router.js",
  "./app/state.js",
  "./app/theme.js",
  "./app/persistence/bootstrap.js",
  "./app/persistence/courses.js",
  "./app/persistence/db.js",
  "./app/persistence/evaluations.js",
  "./app/persistence/evidences.js",
  "./app/persistence/ids.js",
  "./app/persistence/incidents.js",
  "./app/persistence/logbook.js",
  "./app/persistence/learning.js",
  "./app/persistence/navigation.js",
  "./app/persistence/progress.js",
  "./app/persistence/settings.js",
  "./app/persistence/sos.js",
  "./app/persistence/users.js",
  "./components/bottom-sheet.js",
  "./components/lms-player.js",
  "./components/shell.js",
  "./components/sos.js",
  "./components/toast.js",
  "./pages/academy.js",
  "./pages/activity.js",
  "./pages/course.js",
  "./pages/exam.js",
  "./pages/flashcards.js",
  "./pages/home.js",
  "./pages/lesson.js",
  "./pages/login.js",
  "./pages/operations.js",
  "./pages/profile.js",
  "./pages/quiz.js",
  "./pages/results.js",
  "./pages/unit.js",
  "./assets/data/cliente.json",
  "./assets/data/avsec-course.json",
  "./assets/data/avsec-question-bank.json",
  "./assets/data/configuracion.json",
  "./assets/data/consignas.json",
  "./assets/data/cursos.json",
  "./assets/data/demo-data.json",
  "./assets/data/empresa.json",
  "./assets/data/evaluaciones.json",
  "./assets/data/incidentes.json",
  "./assets/data/inventario.json",
  "./assets/data/lecciones.json",
  "./assets/data/lms-demo.json",
  "./assets/data/unidades.json",
  "./assets/data/usuario.json",
  "./assets/images/logo-light-web.jpg",
  "./assets/images/logo-dark-web.png",
  "./assets/images/course-avsec.svg",
  "./assets/images/course-dangerous-goods.svg",
  "./assets/images/course-sms.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32x32.png",
  "./assets/icons/favicon-48x48.png",
  "./assets/icons/favicon.ico",
  "./assets/icons/icon-72x72.png",
  "./assets/icons/icon-96x96.png",
  "./assets/icons/icon-128x128.png",
  "./assets/icons/icon-144x144.png",
  "./assets/icons/icon-152x152.png",
  "./assets/icons/icon-180x180.png",
  "./assets/icons/icon-192x192.png",
  "./assets/icons/icon-384x384.png",
  "./assets/icons/icon-512x512.png",
  "./assets/icons/maskable-icon-512x512.png",
  "./assets/icons/splash-dark-1024.png",
  "./assets/icons/splash-light-1024.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("omniguard-static-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
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
