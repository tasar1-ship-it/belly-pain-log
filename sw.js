var CACHE = 'belly-log-v5';
/* On a very slow connection the stored copy is shown after this long, instead of a white screen. */
var WAIT_MS = 4000;
var SHELL = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches['delete'](k); }));
  }));
  self.clients.claim();
});

/* The page comes from the network when there is signal, so a new version shows on the first open;
   the cached copy is the fallback offline. Icons and the manifest stay cache-first.
   An error answer from the server (404, 5xx) is never shown or stored: it falls back to the cached
   copy, the same as no signal. A redirect is passed on as before, but not stored.
   If the network has not answered after WAIT_MS, the stored copy is shown; the network answer
   still refreshes the stored copy when it arrives. With nothing stored yet, it waits for the network. */
function storedPage() {
  return caches.match('index.html').then(function (r) { return r || caches.match('./'); });
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    var saved = Promise.resolve();
    var network = fetch(e.request).then(function (r) {
      if (r.type === 'opaqueredirect') return r;
      if (!r.ok) throw new Error('error answer');
      var copy = r.clone();
      saved = caches.open(CACHE).then(function (c) { return c.put('index.html', copy); });
      return r;
    })['catch'](storedPage);
    var slow = new Promise(function (resolve) {
      setTimeout(function () { storedPage().then(function (r) { if (r) resolve(r); }); }, WAIT_MS);
    });
    e.respondWith(Promise.race([network, slow]));
    /* Keeps the worker alive until a late network answer has refreshed the stored copy. */
    e.waitUntil(network.then(function () { return saved; })['catch'](function () {}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
