import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import AuthComponent from "../auth/Login"
import HomePage from "../components/pages/Home"
import Header from "../components/layout/Header"
import HistoryPage from "../components/pages/History"
import EarningsPage from "../components/pages/Earnings"
import DebtorsPage from "../components/pages/Debtors"
import Footer from "../components/layout/Footer"
import useEarnings from "../hooks/useEarnings"
import adminRoutes from "./admin"

const AppRoutes = () => {
  const { todayEarnings, refreshTodayEarnings } = useEarnings()

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header todayEarnings={todayEarnings} />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<AuthComponent />} />
            <Route
              path="/"
              element={<HomePage refreshEarnings={refreshTodayEarnings} />}
            />
            <Route
              path="/historial"
              element={<HistoryPage refreshEarnings={refreshTodayEarnings} />}
            />
            <Route path="/ingresos" element={<EarningsPage />} />
            <Route
              path="/deudores"
              element={<DebtorsPage refreshEarnings={refreshTodayEarnings} />}
            />
            {adminRoutes}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default AppRoutes
