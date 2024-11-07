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
    const earnings = await fetchDailyEarnings()

    const today = new Date().toLocaleDateString("en-CA")

    const todayEarning = earnings.find((earning) => {
      const saleDateFormatted = new Date(earning.sale_date).toLocaleDateString(
        "en-CA"
      )
      return saleDateFormatted === today
    })

    return todayEarning ? todayEarning.daily_earnings : 0
  } catch (error) {
    return null
  }
}
