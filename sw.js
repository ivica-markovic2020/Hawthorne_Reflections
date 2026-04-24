const CACHE = 'hc-reflect-v2';

const SHELL = [
  '/',
  '/index.html',
  '/hawthorne.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/pdf.js',
  '/manifest.json',
  '/icon-192.png',
  'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isShell = SHELL.some(u => e.request.url.includes(u));
  if (isShell) {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  }
});
