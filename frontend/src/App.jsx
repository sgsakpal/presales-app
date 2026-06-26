import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Pipeline from './pages/Pipeline'
import Reports from './pages/Reports'

function Sidebar() {
  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/leads', label: 'Leads', icon: '👥' },
    { to: '/pipeline', label: 'Pipeline', icon: '📋' },
    { to: '/reports', label: 'Reports', icon: '📈' },
  ]
  return (
    <aside style={{ width: 220, background: '#1a1a2e', minHeight: '100vh', padding: '2rem 1rem', flexShrink: 0 }}>
      <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: '2rem', padding: '0 0.5rem' }}>
        🚀 Presales App
      </h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              background: isActive ? '#3b82f6' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
