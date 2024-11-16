import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute"
import AuthComponent from "../auth/Login"
import HomePage from "../components/pages/Home"
import HistoryPage from "../components/pages/History"
import EarningsPage from "../components/pages/Earnings"
import DebtorsPage from "../components/pages/Debtors"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import adminRoutes from "./admin"
import useEarnings from "../hooks/useEarnings"
import PublicRoute from "../auth/PublicRoute"

const AppRoutes = () => {
  const { todayEarnings, refreshTodayEarnings } = useEarnings()

  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <Header todayEarnings={todayEarnings} />}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthComponent />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage refreshEarnings={refreshTodayEarnings} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <HistoryPage refreshEarnings={refreshTodayEarnings} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingresos"
            element={
              <ProtectedRoute>
                <EarningsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deudores"
            element={
              <ProtectedRoute>
                <DebtorsPage refreshEarnings={refreshTodayEarnings} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={<ProtectedRoute>{adminRoutes}</ProtectedRoute>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppRoutes
