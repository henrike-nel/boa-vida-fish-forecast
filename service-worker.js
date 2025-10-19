// Fish Forecast Service Worker
const CACHE_NAME = 'fish-forecast-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/home.html',
  '/Boa_Vida_Fish_Finder_data.csv',
  '/data/Boa_Vida_Fish_Finder_data.csv',
  '/assets/icons/fish_forecast_icon-2.png',
  '/assets/icons/fish_forecast_icon.png',
  '/assets/images/fish_logo.png',
  '/assets/images/marlin_image.png',
  '/offline.html'
];

// External resources to cache (critical ones)
const EXTERNAL_RESOURCES = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/papaparse@5.4.1/papaparse.min.js',
  'https://unpkg.com/lodash@4.17.21/lodash.min.js'
];

// Combined assets to cache during installation
const CACHE_ASSETS = [...STATIC_ASSETS, ...EXTERNAL_RESOURCES];

// Service worker installation
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Service worker activation - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients...');
      return self.clients.claim();
    }).then(() => {
      // Notify clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            message: 'New version available'
          });
        });
      });
    })
  );
});

// Fetch event handling with network-first strategy for dynamic content
// and cache-first strategy for static assets
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like Google Analytics
  if (!event.request.url.startsWith(self.location.origin) && 
      !EXTERNAL_RESOURCES.some(resource => event.request.url.startsWith(resource))) {
    return;
  }
  
  // Handle API and data requests with network-first strategy
  if (event.request.url.includes('.csv') || event.request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(event.request));
});

// Network-first strategy: try network first, fall back to cache
async function networkFirstStrategy(request) {
  try {
    // Try to get fresh data from network
    const networkResponse = await fetch(request);
    
    // If successful, clone the response and store it in the cache
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to get from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both network and cache fail for HTML requests, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Otherwise, propagate the error
    throw error;
  }
}

// Cache-first strategy: try cache first, fall back to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, try network
    const networkResponse = await fetch(request);
    
    // For successful responses (not opaque cross-origin responses), cache them
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If both cache and network fail for HTML requests, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Otherwise, propagate the error
    throw error;
  }
}
