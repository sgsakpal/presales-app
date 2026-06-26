import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const STAGES = [
  { key: 'new', label: 'New', color: '#3b82f6', bg: '#dbeafe' },
  { key: 'contacted', label: 'Contacted', color: '#f59e0b', bg: '#fef3c7' },
  { key: 'qualified', label: 'Qualified', color: '#10b981', bg: '#d1fae5' },
  { key: 'disqualified', label: 'Disqualified', color: '#ef4444', bg: '#fee2e2' },
]

export default function Pipeline() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/leads`, getHeaders()).then(r => { setLeads(r.data); setLoading(false) })
  }, [])

  const moveLeadToStage = async (leadId, newStatus) => {
    await axios.patch(`${API}/api/leads/${leadId}`, { status: newStatus }, getHeaders())
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
  }

  const onDragStart = (e, lead) => { setDragging(lead); e.dataTransfer.effectAllowed = 'move' }
  const onDrop = (e, stageKey) => {
    e.preventDefault()
    if (dragging && dragging.status !== stageKey) moveLeadToStage(dragging.id, stageKey)
    setDragging(null)
  }
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  if (loading) return <p style={{ color: '#64748b' }}>Loading pipeline...</p>

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Pipeline</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: 14 }}>Drag and drop leads between stages</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage.key)
          return (
            <div key={stage.key} onDrop={e => onDrop(e, stage.key)} onDragOver={onDragOver}
              style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', borderRadius: '12px 12px 0 0', background: stage.bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: stage.color }}>{stage.label}</span>
                  <span style={{ background: stage.color, color: '#fff', borderRadius: 20, padding: '1px 8px', fontSize: 12, fontWeight: 600 }}>{stageLeads.length}</span>
                </div>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {stageLeads.map(lead => (
                  <div key={lead.id} draggable onDragStart={e => onDragStart(e, lead)}
                    style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', border: '1px solid #e2e8f0', cursor: 'grab', fontSize: 13 }}>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{lead.name}</p>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>{lead.company}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{lead.source}</span>
                      <span style={{ fontWeight: 700, fontSize: 12, color: lead.score >= 80 ? '#10b981' : '#f59e0b' }}>⭐ {lead.score}</span>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#cbd5e1', fontSize: 13 }}>Drop leads here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
