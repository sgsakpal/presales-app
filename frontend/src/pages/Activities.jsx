import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const TYPES = ['call', 'email', 'meeting', 'note', 'task']
const TYPE_ICONS = { call: '📞', email: '📧', meeting: '🤝', note: '📝', task: '✅' }
const empty = { type: 'call', description: '', leadId: '', dueDate: '', completed: false }

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchAll = async () => {
    const [actRes, leadRes] = await Promise.all([
      axios.get(`${API}/api/activities`, getHeaders()),
      axios.get(`${API}/api/leads`, getHeaders())
    ])
    setActivities(actRes.data)
    setLeads(leadRes.data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async () => {
    if (!form.description) return alert('Description is required')
    setSaving(true)
    await axios.post(`${API}/api/activities`, {
      ...form,
      leadId: form.leadId || null,
      dueDate: form.dueDate || null
    }, getHeaders())
    setSaving(false)
    setShowForm(false)
    setForm(empty)
    fetchAll()
  }

  const toggleComplete = async (activity) => {
    await axios.patch(`${API}/api/activities/${activity.id}`,
      { completed: !activity.completed }, getHeaders())
    fetchAll()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return
    await axios.delete(`${API}/api/activities/${id}`, getHeaders())
    fetchAll()
  }

  const getLeadName = (leadId) => leads.find(l => l.id === leadId)?.name || '—'

  const filtered = filter === 'all' ? activities
    : filter === 'pending' ? activities.filter(a => !a.completed)
    : filter === 'completed' ? activities.filter(a => a.completed)
    : activities.filter(a => a.type === filter)

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 12 }
  const btnStyle = (color) => ({ padding: '10px 20px', borderRadius: 8, border: 'none', background: color, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 })

  if (loading) return <p style={{ color: '#64748b' }}>Loading activities...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Activities</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>{activities.length} total activities</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle('#3b82f6')}>
          {showForm ? '✕ Cancel' : '+ Log Activity'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Log New Activity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select style={inputStyle} value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}>
              <option value="">— Select Lead (optional) —</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.company})</option>)}
            </select>
          </div>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }}
            placeholder="Description *"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 4 }}>Due Date</label>
            <input type="datetime-local" style={inputStyle} value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <button onClick={handleSubmit} disabled={saving} style={btnStyle('#10b981')}>
            {saving ? 'Saving...' : '✓ Save Activity'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'completed', ...TYPES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0',
            background: filter === f ? '#3b82f6' : '#fff',
            color: filter === f ? '#fff' : '#64748b',
            cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>
            {TYPE_ICONS[f] || ''} {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(activity => (
          <div key={activity.id} style={{
            background: '#fff', borderRadius: 12, padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 12,
            opacity: activity.completed ? 0.6 : 1
          }}>
            <span style={{ fontSize: 24, marginTop: 2 }}>{TYPE_ICONS[activity.type]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, textDecoration: activity.completed ? 'line-through' : 'none' }}>
                    {activity.description}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {activity.leadId ? `👤 ${getLeadName(activity.leadId)}` : ''}
                    {activity.dueDate ? ` · 📅 ${new Date(activity.dueDate).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => toggleComplete(activity)} style={{
                    padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0',
                    background: activity.completed ? '#d1fae5' : '#fff',
                    color: activity.completed ? '#065f46' : '#64748b',
                    cursor: 'pointer', fontSize: 12
                  }}>
                    {activity.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                  <button onClick={() => handleDelete(activity.id)} style={{
                    padding: '4px 12px', borderRadius: 6, border: '1px solid #fecaca',
                    background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 12
                  }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            No activities found. Click "+ Log Activity" to add one!
          </div>
        )}
      </div>
    </div>
  )
}