import { useEffect, useState } from "react"

const DebtorsPage = () => {
  const [debtors, setDebtors] = useState([])
  const [search, setSearch] = useState("")
  const [filteredDebtors, setFilteredDebtors] = useState([])

  useEffect(() => {
    fetchDebtors()
  }, [])

  const fetchDebtors = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/purchase")
      if (!response.ok) {
        throw new Error("Error al cargar el historial de deudores.")
      }
      let data = await response.json()

      const debtorsData = data
        .filter(
          (purchase) => !purchase.is_paid || purchase.remaining_balance > 0
        )
        .sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date))

      setDebtors(debtorsData)
      setFilteredDebtors(debtorsData)
    } catch (error) {
      console.error("Error al obtener el historial de deudores:", error)
    }
  }

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    setSearch(searchTerm)

    const filtered = debtors.filter((debtor) => {
      const saleDate = new Date(debtor.sale_date)
      const formattedDate = `${String(saleDate.getDate()).padStart(
        2,
        "0"
      )}.${String(saleDate.getMonth() + 1).padStart(2, "0")}.${String(
        saleDate.getFullYear()
      ).slice(-2)}`

      return (
        debtor.student_name.toLowerCase().includes(searchTerm) ||
        debtor.student_code.toString().includes(searchTerm) ||
        formattedDate.includes(searchTerm)
      )
    })

    setFilteredDebtors(filtered)
  }

  return (
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Deudores</h1>
      </div>
      <div className="w-full flex items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre, código o fecha"
          className="w-full p-2 rounded bg-[#2d2d2d] text-white"
        />
      </div>
      <div>
        {filteredDebtors.map((debtor, index) => (
          <div
            key={debtor.sale_id}
            className={`flex justify-between items-center p-2 ${
              index % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#3a3a3a]"
            }`}
          >
            <div className="md:flex-row md:gap-4 flex gap-1 flex-col">
              <p className="font-bold text-xl">
                {String(new Date(debtor.sale_date).getDate()).padStart(2, "0")}.
                {String(new Date(debtor.sale_date).getMonth() + 1).padStart(
                  2,
                  "0"
                )}
                .{String(new Date(debtor.sale_date).getFullYear()).slice(-2)}
                &nbsp;
                {String(new Date(debtor.sale_date).getHours()).padStart(2, "0")}
                :
                {String(new Date(debtor.sale_date).getMinutes()).padStart(
                  2,
                  "0"
                )}
              </p>
              <p>{debtor.student_name}</p>
              <p>{debtor.student_code}</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="">
                <p>{debtor.items.length} libro/s</p>
                <p className="text-red-500">
                  {parseFloat(debtor.remaining_balance).toLocaleString(
                    "es-MX",
                    {
                      style: "currency",
                      currency: "MXN"
                    }
                  )}
                </p>
              </div>
              <button className="bg-[#613BEC] text-white text-sm p-2 rounded transform transition duration-300 hover:bg-[#4c2eb7] hover:scale-105">
                Pagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DebtorsPage
