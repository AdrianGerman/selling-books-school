// App.js
import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@fontsource-variable/onest"
import "./App.css"
import AuthComponent from "./components/LoginPage"
import HomePage from "./components/HomePage"
import Header from "./components/Header"
import HistoryPage from "./components/Header/HistoryPage"
import EarningsPage from "./components/Header/EarningsPage"
import { fetchTodayEarnings } from "./components/utils/earningsUtils"

function App() {
  const [todayEarnings, setTodayEarnings] = useState(0)

  const refreshTodayEarnings = async () => {
    const earnings = await fetchTodayEarnings()
    setTodayEarnings(earnings)
  }

  useEffect(() => {
    refreshTodayEarnings()
  }, [])

  return (
    <Router>
      <Header todayEarnings={todayEarnings} />
      <Routes>
        <Route path="/login" Component={AuthComponent} />
        <Route
          path="/"
          element={<HomePage refreshEarnings={refreshTodayEarnings} />}
        />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/ingresos" element={<EarningsPage />} />
      </Routes>
    </Router>
  )
}

export default App
