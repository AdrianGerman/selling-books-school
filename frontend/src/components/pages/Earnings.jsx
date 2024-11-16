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
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <h1 className="text-2xl font-bold mb-4">Venta de libros por día</h1>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 ">
        {" "}
        {earnings.map((earning, index) => (
          <div
            key={earning.sale_date}
            className="bg-[#323232] text-center p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-24 w-full"
          >
            <div className="text-xl font-bold mb-1">
              {new Date(earning.sale_date).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit"
              })}
            </div>
            <div className="text-white text-md mb-1">
              {parseFloat(earning.daily_earnings).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
              })}
            </div>
            <div className="text-white text-md">
              {earning.books_sold || 0} libros vendidos
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EarningsPage
