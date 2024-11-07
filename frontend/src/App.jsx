import useEarnings from "./hooks/useEarnings"
import AppRoutes from "./routes"

function App() {
  const { todayEarnings, refreshTodayEarnings } = useEarnings()

  return (
    <AppRoutes
      todayEarnings={todayEarnings}
      refreshEarnings={refreshTodayEarnings}
    />
  )
}

export default App
