import api from './api'

// ── Register ─────────────────────────────────────────────
// POST /auth/register  →  { username, email, password }
export const register = async ({ name, user_name, email, password }) => {
  const res = await api.post('/auth/register', {
    name,
    user_name,
    email,
    password
  })
  return res.data
}
// ── Login ────────────────────────────────────────────────
// POST /auth/login  →  { access_token, user }
// Persists token + user to localStorage
export const login = async ({ user_name, password }) => {
  const res = await api.post('/auth/login', {
    user_name: email,
    password
  })
  return res.data
}

// ── Logout ───────────────────────────────────────────────
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ── Helpers ──────────────────────────────────────────────
export const getCurrentUser   = () => JSON.parse(localStorage.getItem('user') || 'null')
export const isAuthenticated  = () => Boolean(localStorage.getItem('token'))