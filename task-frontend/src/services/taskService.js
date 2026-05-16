import api from './api'

// ── Read ─────────────────────────────────────────────────
export const getTasks     = async ()     => (await api.get('/tasks')).data
export const getTaskById  = async (id)   => (await api.get(`/tasks/${id}`)).data

// ── Create ───────────────────────────────────────────────
// payload: { title, description, priority, due_date, completed }
export const createTask   = async (payload) => (await api.post('/tasks', payload)).data

// ── Update ───────────────────────────────────────────────
export const updateTask   = async (id, payload) => (await api.put(`/tasks/${id}`, payload)).data

// ── Delete ───────────────────────────────────────────────
export const deleteTask   = async (id)   => (await api.delete(`/tasks/${id}`)).data

// ── Toggle status ────────────────────────────────────────
export const toggleStatus = async (id, completed) =>
  (await api.patch(`/tasks/${id}/status`, { completed })).data