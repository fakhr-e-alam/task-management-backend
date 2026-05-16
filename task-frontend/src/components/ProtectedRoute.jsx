import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../services/authService'

// Wraps any route that requires a valid JWT.
// If no token is found in localStorage → redirect to /login.
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
