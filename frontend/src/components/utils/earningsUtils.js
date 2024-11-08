export const fetchDailyEarnings = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/purchase/daily-earnings"
    )
    if (!response.ok) {
      throw new Error("Error al obtener las ganancias diarias.")
    }
    const earnings = await response.json()
    return earnings
  } catch (error) {
    console.error("Error al obtener las ganancias diarias:", error)
    return []
  }
}

export const fetchTodayEarnings = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/purchase/earnings-today"
    )
    if (!response.ok) {
      throw new Error("Error al obtener las ganancias de hoy.")
    }
    const data = await response.json()
    return data.daily_earnings || 0
  } catch (error) {
    console.error("Error al obtener las ganancias de hoy:", error)
    return 0
  }
}
