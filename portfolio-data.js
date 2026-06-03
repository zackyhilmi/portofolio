/**
 * portfolio-data.js
 * Shared data layer — reads from Firebase Firestore if configured,
 * falls back to static defaults if not. Import this in every portfolio page.
 * Usage: <script type="module" src="portfolio-data.js"></script>
 */

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Load saved Firebase config ──
function getConfig() {
  try {
    const raw = localStorage.getItem('fb_config');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

let _db = null;

export async function initDB() {
  const cfg = getConfig();
  if (!cfg || !cfg.apiKey) return null;
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(cfg);
    _db = getFirestore(app);
    return _db;
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
    return null;
  }
}

export async function fetchCollection(name) {
  if (!_db) return null;
  try {
    const snap = await getDocs(collection(_db, name));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn(`Failed to fetch ${name}:`, e.message);
    return null;
  }
}

export async function fetchSection(name) {
  if (!_db) {
    // Fallback to localStorage cms_section data
    try {
      const raw = localStorage.getItem('cms_section_' + name);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  try {
    const snap = await getDoc(doc(_db, 'sections', name));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

/** Render helpers */
export function pill(text, highlight = false) {
  return `<span class="skill-pill${highlight ? ' highlight' : ''}">${text}</span>`;
}

export function badgeClass(type) {
  const map = { fulltime: 'badge-fulltime', freelance: 'badge-freelance', intern: 'badge-intern', seasonal: 'badge-intern' };
  return map[type] || 'badge-freelance';
}
