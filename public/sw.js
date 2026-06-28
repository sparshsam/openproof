/**
 * OpenProof Service Worker v0.9.0
 *
 * Strategy: Cache-First for static assets, Network-First for dynamic routes.
 * Keeps the app functional offline for previously visited pages and assets.
 *
 * OpenProof is a local-first app — no user data is stored in the cache,
 * and no file contents are ever uploaded or cached by this worker.
 */

const CACHE_NAME = "openproof-v0.9.0";
const STATIC_ASSETS = [
  "/",
  "/create",
  "/verify",
  "/about",
  "/privacy",
  "/terms",
  "/docs",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/proof/",
  "/bundle/",
];

// Routes that should always be fetched from the network
const NETWORK_ONLY_PATTERNS = [
  "sepolia.base.org",
  "walletconnect",
  "reown.com",
  "basescan.org",
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
          .map((name) => {
            console.log(`[SW] Clearing old cache: ${name}`);
            return caches.delete(name);
          }),
      );
    }).then(() => self.clients.claim()),
  );
});

// ── Message handling for cache migration ───────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "CLEAR_CACHE") {
    caches.keys().then((names) => {
      Promise.all(names.map((n) => caches.delete(n))).then(() => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ type: "CACHE_CLEARED" }));
        });
      });
    });
  }
});

// ── Fetch: cache-first for static, network-first for dynamic ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    // Network-only for external API calls
    if (NETWORK_ONLY_PATTERNS.some((p) => url.hostname.includes(p))) {
      return;
    }
    event.respondWith(fetch(request).catch(() => new Response(null, { status: 408 })));
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
