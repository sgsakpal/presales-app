import { useEffect, useState } from 'react'
import axios from 'axios'

//const API = 'http://localhost:5000'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', borderLeft: `4px solid ${color}` }}>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e' }}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
// Change this
//axios.get(`${API}/api/leads`)

// To this
axios.get(`${API}/api/leads`, getHeaders())

      .then(r => { setLeads(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = leads.length
  const newLeads = leads.filter(l => l.status === 'new').length
  const qualified = leads.filter(l => l.status === 'qualified').length
  const avgScore = leads.length ? Math.round(leads.reduce((a, b) => a + b.score, 0) / leads.length) : 0

  if (loading) return <p style={{ color: '#64748b' }}>Loading dashboard...</p>

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Welcome back! Here's your presales overview.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        <StatCard label="Total Leads" value={total} color="#3b82f6" />
        <StatCard label="New Leads" value={newLeads} color="#f59e0b" />
        <StatCard label="Qualified" value={qualified} color="#10b981" />
        <StatCard label="Avg Score" value={avgScore} color="#8b5cf6" />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Recent Leads</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              {['Name', 'Company', 'Source', 'Status', 'Score'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '10px 12px', color: '#64748b' }}>{lead.company}</td>
                <td style={{ padding: '10px 12px', color: '#64748b' }}>{lead.source}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: lead.status === 'qualified' ? '#d1fae5' : lead.status === 'new' ? '#dbeafe' : '#fef3c7',
                    color: lead.status === 'qualified' ? '#065f46' : lead.status === 'new' ? '#1e40af' : '#92400e'
                  }}>{lead.status}</span>
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: lead.score >= 80 ? '#10b981' : '#f59e0b' }}>{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
