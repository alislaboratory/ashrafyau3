// Client-side gate for the hidden admin panel.
// NOTE: this is obfuscation, not server-grade security. Anyone who reads the
// bundle can see this hash; SHA-256 just keeps the password out of plaintext.
// For a static personal site with no backend this is the best achievable.

const SESSION_KEY = 'ashrafyau_admin_session';
const PWHASH_KEY = 'ashrafyau_admin_pwhash';

// SHA-256 of the default password: "actuator-admin"
const DEFAULT_HASH = 'f41c6e281cd6c03b390036914e76afa8053d8e5d506928bd22aec22d37eaab47';

export async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function currentHash() {
  return localStorage.getItem(PWHASH_KEY) || DEFAULT_HASH;
}

export async function login(password) {
  const hash = await sha256(password);
  if (hash === currentHash()) {
    sessionStorage.setItem(SESSION_KEY, '1');
    return true;
  }
  return false;
}

export function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function changePassword(newPassword) {
  const hash = await sha256(newPassword);
  localStorage.setItem(PWHASH_KEY, hash);
}

export function usingDefaultPassword() {
  return !localStorage.getItem(PWHASH_KEY);
}
