import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const decodedToken = jwtDecode(token)
    const userRole = decodedToken.role

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />
    }

    return children
  } catch (err) {
    console.error("Error al decodificar el token:", err)
    return <Navigate to="/login" replace />
  }
}

export default RoleProtectedRoute
