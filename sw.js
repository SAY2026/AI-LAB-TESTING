/* SAY AI Lab offline cache. Bump VERSION whenever the pages change. */
var VERSION = "say-v12";
var ASSETS = ["safari-ya-kichina.html", "safari.webmanifest", "safari-icon-192.png", "safari-icon-512.png", "safari-icon-180.png", "f2-online.html", "f4-online.html", "f2-kit.html", "f2kit-dodoso-kabla.html", "f2kit-jaribio-a.html", "f2kit-jaribio-b.html", "f2kit-mtihani.html", "f2kit-dodoso-baada.html", "f2kit-kijitabu.html", "f2kit-mapengo.html", "f2kit-mapengo-dunga.html", "f2kit-kijitabu2.html", "f2kit-mtihani2-key.html", "f2kit-mtihani2.html", "f2kit-kiwango-key.html", "f2kit-kiwango.html", "f2kit-kijitabu3.html", "f2kit-mwalimu.html", "f2kit-handbook.html", "f4kit-kijitabu.html", "f4kit-mtihani-a.html", "f4kit-mtihani-b.html", "f4kit-mtihani-a-key.html", "f4kit-mtihani-b-key.html"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
/* Network first, so updates arrive when online; the cached copy is used when offline. Other pages of the site are left alone. */
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (!ASSETS.some(function (a) { return u.pathname.endsWith("/" + a); })) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok) { var copy = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
