import PocketBase from 'pocketbase';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

const pb = new PocketBase(POCKETBASE_URL);

// 🔥 KRUSIAL: Set auto-cancellation false
pb.autoCancellation(false);

// 🔥 KRUSIAL: Load dari localStorage
const savedToken = localStorage.getItem('pb_token');
const savedAuth = localStorage.getItem('pb_auth');

if (savedToken && savedAuth) {
  try {
    const parsed = JSON.parse(savedAuth);
    const user = parsed.record || parsed.model;
    if (user) {
      pb.authStore.save(savedToken, user);
      console.log('✅ Auth loaded from localStorage');
    }
  } catch (e) {
    console.error('❌ Failed to load auth:', e);
  }
}

console.log('🔧 PocketBase initialized, isValid:', pb.authStore.isValid);

export default pb;
export { pb as pocketbaseClient };