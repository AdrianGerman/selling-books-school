import { useEffect, useState } from "react"
import { fetchDailyEarnings } from "../utils/earningsUtils"

const EarningsPage = () => {
  const [earnings, setEarnings] = useState([])

  useEffect(() => {
    const fetchEarnings = async () => {
      const earningsData = await fetchDailyEarnings()
      setEarnings(earningsData)
    }

    fetchEarnings()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ganancias diarias</h1>
      <div className="bg-[#323232] p-4 rounded">
        {earnings.map((earning, index) => (
          <div
            key={earning.sale_date}
            className={`flex justify-between items-center p-2 ${
              index % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#3a3a3a]"
            }`}
          >
            <div className="text-xl font-bold">
              {new Date(earning.sale_date).toLocaleDateString()}
            </div>
            <div className="text-white text-lg">
              {parseFloat(earning.daily_earnings).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EarningsPage
