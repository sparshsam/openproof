/**
 * OpenProof Service Worker v0.1.1
 *
 * Strategy: Cache-First for static assets, Network-First for dynamic routes.
 * Keeps the app functional offline for previously visited pages and assets.
 *
 * OpenProof is a local-first app — no user data is stored in the cache,
 * and no file contents are ever uploaded or cached by this worker.
 */

const CACHE_NAME = "openproof-v0.1.2";
const STATIC_ASSETS = [
  "/",
  "/create",
  "/verify",
  "/docs",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  "/robots.txt",
  "/sitemap.xml",
];

// ── Install: pre-cache static assets ──────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting()),
  );
});

// ── Activate: clean old caches ─────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }).then(() => self.clients.claim()),
  );
});

// ── Fetch: cache-first for static, network-first for dynamic ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // API calls and wallet connections: network-only
  if (
    url.hostname === "sepolia.base.org" ||
    url.href.includes("walletconnect") ||
    url.href.includes("reown.com")
  ) {
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/_next/static")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      }),
    );
    return;
  }

  // Navigation (HTML pages): network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match("/");
      }),
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(
    fetch(request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, response.clone());
        return response;
      });
    }).catch(() => caches.match(request)),
  );
});
