import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Pipeline from './pages/Pipeline'
import Reports from './pages/Reports'
import Login from './pages/Login'

function Sidebar({ user, onLogout }) {
  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/leads', label: 'Leads', icon: '👥' },
    { to: '/pipeline', label: 'Pipeline', icon: '📋' },
    { to: '/reports', label: 'Reports', icon: '📈' },
  ]
  return (
    <aside style={{ width: 220, background: '#1a1a2e', minHeight: '100vh', padding: '2rem 1rem', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: '2rem', padding: '0 0.5rem' }}>
        🚀 Presales App
      </h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
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
      <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: '1rem', marginTop: '1rem' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, padding: '0 12px' }}>{user?.name}</p>
        <button onClick={onLogout} style={{
          width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none',
          background: '#2d2d4e', color: '#94a3b8', cursor: 'pointer', fontSize: 13, textAlign: 'left'
        }}>🚪 Logout</button>
      </div>
    </aside>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} onLogout={handleLogout} />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minHeight: '100vh' }}>
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