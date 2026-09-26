// Client-side session token storage. The server issues a signed JWT on successful login
// (see server.ts POST /api/auth/login); this is the single place that stores/reads/clears it,
// so every component that calls an admin-protected route attaches it the same way.
const TOKEN_KEY = 'kalasetu_session_token';

export function setSessionToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
}

export function getSessionToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

export function clearSessionToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
}

// Spread into a fetch() headers object: `headers: { 'Content-Type': 'application/json', ...authHeaders() }`
export function authHeaders(): Record<string, string> {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
