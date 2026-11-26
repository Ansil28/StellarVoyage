// STELLARVOYAGE SERVICE WORKER
// Lets the site open without internet once it has been visited.
//
// - The site's own files: network first, so new versions show up
//   straight away; the saved copy is only used when offline.
// - satellite.js and fonts (versioned, never change): saved copy first.
// - Everything else (launch API, CelesTrak, Cesium, images) goes
//   straight to the network. The app already keeps the latest launch
//   and orbital data in localStorage for when it is offline.
//
// If you add a new file to the site, add it to APP_FILES too.

const CACHE_VERSION = "v1";
const APP_CACHE = `stellarvoyage-app-${CACHE_VERSION}`;
const LIBRARY_CACHE = `stellarvoyage-libraries-${CACHE_VERSION}`;

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./guide-topics.js",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/apple-touch-icon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/guide/fundamentals.jpg",
  "./assets/guide/types.jpg",
  "./assets/guide/propulsion.jpg",
  "./assets/guide/anatomy.jpg",
  "./assets/guide/stages.jpg",
  "./assets/guide/filling-station.jpg",
  "./assets/guide/glossary.jpg",
  "./assets/guide/rocket-forces.svg",
  "./assets/guide/rocket-types.svg",
  "./assets/guide/rocket-engine.svg",
  "./assets/guide/rocket-anatomy.svg",
  "./assets/guide/rocket-flight.svg",
  "./assets/guide/filling-station.svg"
];

const LIBRARY_HOSTS = [
  "cdn.jsdelivr.net",
  "fonts.googleapis.com",
  "fonts.gstatic.com"
];

// How long to wait for the network before using the saved copy
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// Remove caches from older versions of this file
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          // Also removes caches from when the site was called SpaceHub
          .filter((key) =>
            (key.startsWith("stellarvoyage-") || key.startsWith("spacehub-")) &&
            key !== APP_CACHE &&
            key !== LIBRARY_CACHE
          )
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // "Add to calendar" on iPhone: app.js puts the event in the link and
  // this returns it as a real calendar file, which Safari opens in the
  // Calendar app (iPhone Safari refuses calendar data in a data: link)
  if (
    url.origin === self.location.origin &&
    url.pathname.endsWith("/launch.ics")
  ) {
    event.respondWith(new Response(url.searchParams.get("event") || "", {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="launch.ics"'
      }
    }));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (LIBRARY_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }

  // Anything else is not handled here and goes to the network as usual
});

async function networkFirst(request) {
  const cache = await caches.open(APP_CACHE);

  try {
    // "no-cache" asks the server whether the file changed, so a new
    // version of the site is used as soon as it is published
    const response = await withTimeout(
      fetch(request.url, { cache: "no-cache", credentials: "same-origin" }),
      NETWORK_TIMEOUT_MS
    );

    if (response.ok) {
      cache.put(stripSearch(request.url), response.clone());
    }

    return response;
  } catch (error) {
    const saved =
      (await cache.match(stripSearch(request.url))) ||
      (request.mode === "navigate" ? await cache.match("./") : undefined);

    if (saved) {
      return saved;
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(LIBRARY_CACHE);
  const saved = await cache.match(request);

  if (saved) {
    return saved;
  }

  const response = await fetch(request);

  // Opaque responses (status 0) come from requests without CORS, such
  // as the Google Fonts stylesheet; they are small and still usable
  if (response.ok || response.type === "opaque") {
    cache.put(request, response.clone());
  }

  return response;
}

function withTimeout(promise, milliseconds) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Network timeout")), milliseconds);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// "index.html?x=1" and "index.html" share one saved copy
function stripSearch(address) {
  const url = new URL(address);
  url.search = "";
  url.hash = "";
  return url.href;
}
