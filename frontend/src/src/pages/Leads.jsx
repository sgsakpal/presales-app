import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const empty = { name: '', email: '', phone: '', company: '', source: 'website', status: 'new', score: 50 }

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const fetchLeads = () => {
    axios.get(`${API}/api/leads`, getHeaders()).then(r => { setLeads(r.data); setLoading(false) })
  }

  useEffect(() => { fetchLeads() }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.company) return alert('Name, email and company are required')
    setSaving(true)
    await axios.post(`${API}/api/leads`, { ...form, score: Number(form.score) }, getHeaders())
    setSaving(false)
    setShowForm(false)
    setForm(empty)
    fetchLeads()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return
    await axios.delete(`${API}/api/leads/${id}`, getHeaders())
    fetchLeads()
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 12 }
  const btnStyle = (color) => ({ padding: '10px 20px', borderRadius: 8, border: 'none', background: color, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 })

  if (loading) return <p style={{ color: '#64748b' }}>Loading leads...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Leads</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>{leads.length} total leads</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle('#3b82f6')}>
          {showForm ? '✕ Cancel' : '+ Add Lead'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>New Lead</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input style={inputStyle} placeholder="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <select style={inputStyle} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="cold_call">Cold Call</option>
              <option value="social_media">Social Media</option>
              <option value="event">Event</option>
            </select>
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="disqualified">Disqualified</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: '#64748b' }}>Lead Score: {form.score}</label>
            <input type="range" min="0" max="100" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} style={{ width: '100%', marginTop: 4 }} />
          </div>
          <button onClick={handleSubmit} disabled={saving} style={btnStyle('#10b981')}>
            {saving ? 'Saving...' : '✓ Save Lead'}
          </button>
        </div>
      )}

      <input style={{ ...inputStyle, marginBottom: '1rem', maxWidth: 300 }} placeholder="🔍 Search by name or company..." value={search} onChange={e => setSearch(e.target.value)} />

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['Name', 'Company', 'Phone', 'Source', 'Status', 'Score', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 500, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.company}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.phone || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.source}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: lead.status === 'qualified' ? '#d1fae5' : lead.status === 'new' ? '#dbeafe' : lead.status === 'contacted' ? '#fef3c7' : '#fee2e2',
                    color: lead.status === 'qualified' ? '#065f46' : lead.status === 'new' ? '#1e40af' : lead.status === 'contacted' ? '#92400e' : '#991b1b'
                  }}>{lead.status}</span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: lead.score >= 80 ? '#10b981' : lead.score >= 60 ? '#f59e0b' : '#ef4444' }}>{lead.score}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleDelete(lead.id)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No leads found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
