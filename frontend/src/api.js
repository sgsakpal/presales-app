const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getLeads = () =>
  fetch(`${API}/api/leads`).then(r => r.json())

export const createLead = (data) =>
  fetch(`${API}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const updateLead = (id, data) =>
  fetch(`${API}/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const deleteLead = (id) =>
  fetch(`${API}/api/leads/${id}`, { method: 'DELETE' }).then(r => r.json())
