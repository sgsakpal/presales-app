import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const url = mode === 'login' ? `${API}/api/auth/login` : `${API}/api/auth/register`
      const res = await axios.post(url, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 12, outline: 'none'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>🚀 Presales App</h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem', fontSize: 14 }}>
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>

        {mode === 'register' && (
          <input style={inputStyle} placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input style={inputStyle} placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '11px', borderRadius: 8, border: 'none',
          background: '#3b82f6', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer'
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: '#64748b' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}