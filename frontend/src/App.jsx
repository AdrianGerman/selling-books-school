import { BrowserRouter as Router } from "react-router-dom"
import useEarnings from "./hooks/useEarnings"
import AppRoutes from "./routes"

function App() {
  const { todayEarnings, refreshTodayEarnings } = useEarnings()

  return (
    <Router>
      <AppRoutes
        todayEarnings={todayEarnings}
        refreshEarnings={refreshTodayEarnings}
      />
    </Router>
  )
}

export default App
