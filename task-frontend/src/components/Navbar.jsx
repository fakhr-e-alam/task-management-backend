import { Link, useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../services/authService'

// CheckSquare icon (inline SVG — no icon library needed)
const CheckSquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const Navbar = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-brand-icon">
            <CheckSquareIcon />
          </span>
          TaskManager
        </Link>

        {/* Right side */}
        <div className="navbar-right">
          {user && (
            <span className="navbar-user">
              Hello, <strong>{user.username ?? user.email}</strong>
            </span>
          )}
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
