import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import AuthComponent from "../auth/Login"
import HomePage from "../components/pages/Home"
import Header from "../components/layout/Header"
import HistoryPage from "../components/pages/History"
import EarningsPage from "../components/pages/Earnings"
import DebtorsPage from "../components/pages/Debtors"

const AppRoutes = ({ todayEarnings, refreshEarnings }) => (
  <Router>
    <Header todayEarnings={todayEarnings} />
    <Routes>
      <Route path="/login" element={<AuthComponent />} />
      <Route
        path="/"
        element={<HomePage refreshEarnings={refreshEarnings} />}
      />
      <Route path="/historial" element={<HistoryPage />} />
      <Route path="/ingresos" element={<EarningsPage />} />
      <Route path="/deudores" element={<DebtorsPage />} />
    </Routes>
  </Router>
)

export default AppRoutes
