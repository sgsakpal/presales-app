const nav = [
  { id: 'dashboard', label: 'Dashboard',  icon: '📊' },
  { id: 'leads',     label: 'Leads',      icon: '👥' },
  { id: 'pipeline',  label: 'Pipeline',   icon: '📋' },
  { id: 'reports',   label: 'Reports',    icon: '📈' },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside style={{
      width: 220, background: '#1a1a2e', color: '#fff',
      display: 'flex', flexDirection: 'column', padding: '1.5rem 0'
    }}>
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#7c6af7' }}>⚡ PreSales</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Management App</div>
      </div>
      {nav.map(n => (
        <button key={n.id} onClick={() => onNavigate(n.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0.75rem 1.5rem', border: 'none',
          background: active === n.id ? 'rgba(124,106,247,0.2)' : 'transparent',
          color: active === n.id ? '#7c6af7' : '#ccc',
          borderLeft: active === n.id ? '3px solid #7c6af7' : '3px solid transparent',
          fontSize: 14, textAlign: 'left', width: '100%',
          transition: 'all 0.15s'
        }}>
          <span>{n.icon}</span>
          <span>{n.label}</span>
        </button>
      ))}
    </aside>
  )
}
