import { useEffect, useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

//const API = 'http://localhost:5000'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Reports() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/leads`).then(r => { setLeads(r.data); setLoading(false) })
  }, [])

  const bySource = Object.entries(
    leads.reduce((acc, l) => ({ ...acc, [l.source]: (acc[l.source] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }))

  const byStatus = Object.entries(
    leads.reduce((acc, l) => ({ ...acc, [l.status]: (acc[l.status] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }))

  const scoreRanges = [
    { name: '0–25', value: leads.filter(l => l.score <= 25).length },
    { name: '26–50', value: leads.filter(l => l.score > 25 && l.score <= 50).length },
    { name: '51–75', value: leads.filter(l => l.score > 50 && l.score <= 75).length },
    { name: '76–100', value: leads.filter(l => l.score > 75).length },
  ]

  if (loading) return <p style={{ color: '#64748b' }}>Loading reports...</p>

  const cardStyle = { background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Reports</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: 14 }}>Visual overview of your presales pipeline</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Leads by Source</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bySource}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Leads by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Lead Score Distribution</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={scoreRanges}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
