import { useState, useEffect } from "react"
import { fetchTodayEarnings } from "../components/utils/earningsUtils"

const useEarnings = () => {
  const [todayEarnings, setTodayEarnings] = useState(0)

  const refreshTodayEarnings = async () => {
    const earnings = await fetchTodayEarnings()
    setTodayEarnings(earnings)
  }

  useEffect(() => {
    refreshTodayEarnings()
  }, [])

  return { todayEarnings, refreshTodayEarnings }
}

export default useEarnings
