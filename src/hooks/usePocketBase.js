import PocketBase from 'pocketbase';

// In dev, Vite proxies /api → http://127.0.0.1:8090
// In production, Nginx proxies /api → http://127.0.0.1:8090
// Using window.location.origin so the URL is always relative to the current domain
const pb = new PocketBase(window.location.origin);

export default pb;
