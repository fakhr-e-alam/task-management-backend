import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login } from '../services/authService'

const LogoIcon = () => (
  <span className="auth-logo-icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  </span>
)

const Register = () => {
  const navigate = useNavigate()

  // ✅ FIXED STATE (matches backend)
  const [form, setForm] = useState({
    name: '',
    user_name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // ✅ register user
      await register(form)

      // ✅ auto login (IMPORTANT FIX: backend uses user_name)
      await login({
        user_name: form.user_name,
        password: form.password
      })

      // redirect
      navigate('/dashboard')

    } 
    catch (err) {
  console.error("FULL ERROR:", err.response?.data);

  setError(
    err.response?.data?.detail?.[0]?.msg ||
    err.response?.data?.detail ||
    JSON.stringify(err.response?.data) ||
    'Registration failed. Please try again.'
  )
} finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">TaskManager</span>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Get started — it&apos;s completely free</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          {/* USERNAME */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="user_name"
              className="form-input"
              value={form.user_name}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoComplete="username"
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="divider">or</div>

        <p className="auth-footer">
          Already have an account?&nbsp;
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Register