// Minimal Service Worker for WOWGamerES PWA installation
// Behaves as a pass-through network-only proxy to prevent issues with advertising or real-time page updates.

const CACHE_NAME = 'wowgameres-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser fetch resources normally from the network
  event.respondWith(fetch(event.request));
});
