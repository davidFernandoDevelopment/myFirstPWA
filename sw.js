//IMPORTS DE SERVICE WORKER UTILS.
importScripts("js/sw-utils.js");

const CACHE_STATIC = "static-v1";
const CACHE_DYNAMIC = "dinamyc-v1";
const CACHE_INMUTABLE = "inmutable-v1";

const APP_SHELL = [
  "/",
  "js/app.js",
  "js/sw-utils.js", // LO ESTOY IMPORTANDO
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/spiderman.jpg",
  "img/avatars/wolverine.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/hulk.jpg",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "js/libs/jquery.js",
  "css/animate.css",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(CACHE_STATIC)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(CACHE_INMUTABLE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const activando = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_STATIC && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(activando);
});

self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then((newRes) => {
        return actualizaCacheDinamico(CACHE_DYNAMIC, e.request, newRes);
      });
    }
  });
  e.respondWith(respuesta);
});
