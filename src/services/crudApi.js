/**
 * Client for the new CRUD + auth + proposal backend on port 5001.
 * The original matching backend on 5000 (apiService.js) is left untouched.
 */

const CRUD_BASE_URL =
  process.env.REACT_APP_CRUD_API_URL || 'http://localhost:5001/api'

const TIMEOUT_MS = 30000

async function request(path, { method = 'GET', body, token, timeout } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout || TIMEOUT_MS)

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`${CRUD_BASE_URL}${path}`, {
      method,
      headers,
      signal: controller.signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    clearTimeout(timer)

    let payload = null
    try {
      payload = await res.json()
    } catch (_) {
      payload = null
    }

    if (!res.ok) {
      const message =
        (payload && (payload.error || payload.message)) ||
        `Request failed (${res.status})`
      throw new Error(message)
    }
    return payload
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') throw new Error('Request timed out')
    throw err
  }
}

export const crudApi = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: (token) => request('/auth/logout', { method: 'POST', token }),
  deleteUser: (userId) =>
    request(`/auth/user/${userId}`, { method: 'DELETE' }),

  // SME profile
  getSme: (userId) => request(`/sme/${userId}`),
  upsertSme: (userId, payload) =>
    request(`/sme/${userId}`, { method: 'PATCH', body: payload }),
  createSme: (payload) => request('/sme', { method: 'POST', body: payload }),

  // Events
  listEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (payload) => request('/events', { method: 'POST', body: payload }),
  updateEvent: (id, payload) =>
    request(`/events/${id}`, { method: 'PATCH', body: payload }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Booths + sponsorships
  listBooths: (eventId) => request(`/events/${eventId}/booths`),
  listSponsorships: (eventId) => request(`/events/${eventId}/sponsorships`),

  // Applications
  submitApplication: (payload) =>
    request('/applications', { method: 'POST', body: payload }),
  listApplications: (userId) => request(`/applications/sme/${userId}`),
  deleteApplication: (id) =>
    request(`/applications/${id}`, { method: 'DELETE' }),

  // AI proposal
  generateProposal: (payload) =>
    request('/proposal/generate', {
      method: 'POST',
      body: payload,
      timeout: 90000,
    }),
}

export default crudApi
