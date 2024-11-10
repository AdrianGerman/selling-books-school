import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import AuthComponent from "../auth/Login"
import HomePage from "../components/pages/Home"
import Header from "../components/layout/Header"
import HistoryPage from "../components/pages/History"
import EarningsPage from "../components/pages/Earnings"
import DebtorsPage from "../components/pages/Debtors"
import useEarnings from "../hooks/useEarnings"
import Footer from "../components/layout/Footer"

const AppRoutes = () => {
  const { todayEarnings, refreshTodayEarnings } = useEarnings()

  return (
    <Router>
      <Header todayEarnings={todayEarnings} />
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
      </Routes>
      <Footer />
    </Router>
  )
}

export default AppRoutes
