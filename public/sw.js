// MediLearn Academy service worker
// Scope: cache the static app shell for fast loads and basic offline access
// to the UI itself. It intentionally does NOT cache:
//   - Supabase API/auth calls (anything to *.supabase.co)
//   - Any /storage/ or signed-URL resource paths (protected course media)
// so that admin download permissions and enrollment checks are never
// bypassed by the cache.

const CACHE_NAME = 'medilearn-shell-v1'
const APP_SHELL = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

function isProtectedOrDynamic(url) {
  return (
    url.hostname.endsWith('supabase.co') ||
    url.pathname.startsWith('/storage/') ||
    url.pathname.startsWith('/api/')
  )
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (event.request.method !== 'GET' || isProtectedOrDynamic(url)) {
    // Always go to the network for auth, data, and protected media.
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
