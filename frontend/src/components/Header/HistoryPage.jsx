import { useEffect, useState } from "react"

const HistoryPage = () => {
  const [purchases, setPurchases] = useState([])
  const [search, setSearch] = useState("")
  const [filteredPurchases, setFilteredPurchases] = useState([])

  // TODOS:
  // 1. Poder organizar no solo las compras por dia si no por hora de creación (nuevo campo en la BD)
  // 2. Poder borrar ordenes
  // 3. Poder borrar todas las ordenes (para un reset al final del semestre)
  // TODO ESTO SON TAREAS EN LAS QUE NECESITO CREAR NUEVOS ENDPOINT EN EL BACKEND

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/purchase")
        if (!response.ok) {
          throw new Error("Error al cargar el historial de compras.")
        }
        let data = await response.json()

        data = data.sort(
          (a, b) => new Date(b.sale_date) - new Date(a.sale_date)
        )

        setPurchases(data)
        setFilteredPurchases(data)
      } catch (error) {
        console.error("Error al obtener el historial:", error)
      }
    }

    fetchPurchases()
  }, [])

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    setSearch(searchTerm)

    const filtered = purchases.filter((purchase) => {
      const saleDate = new Date(purchase.sale_date)
      const formattedDate = `${String(saleDate.getDate()).padStart(
        2,
        "0"
      )}.${String(saleDate.getMonth() + 1).padStart(2, "0")}.${String(
        saleDate.getFullYear()
      ).slice(-2)}`

      return (
        purchase.student_name.toLowerCase().includes(searchTerm) ||
        purchase.student_code.toString().includes(searchTerm) ||
        formattedDate.includes(searchTerm)
      )
    })

    setFilteredPurchases(filtered)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Compras</h1>
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
        {filteredPurchases.map((purchase, index) => (
          <div
            key={purchase.sale_id}
            className={`flex justify-between items-center p-2 ${
              index % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#3a3a3a]"
            }`}
          >
            <div className="md:flex-row md:gap-4 flex gap-1 flex-col">
              <p className="font-bold text-xl">
                {String(new Date(purchase.sale_date).getDate()).padStart(
                  2,
                  "0"
                )}
                .
                {String(new Date(purchase.sale_date).getMonth() + 1).padStart(
                  2,
                  "0"
                )}
                .{String(new Date(purchase.sale_date).getFullYear()).slice(-2)}
              </p>
              <p>{purchase.student_name}</p>
              <p>{purchase.student_code}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div>
                <span
                  className={`px-4 py-1 text-sm rounded-full ${
                    purchase.is_paid ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {purchase.is_paid ? "Pagado" : "Deuda"}
                </span>
              </div>
              <div className="">
                <p>{purchase.items.length} libros</p>
                <p>${parseFloat(purchase.total_amount).toFixed(2)} mxn</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
