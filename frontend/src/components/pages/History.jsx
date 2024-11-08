import { useEffect, useState } from "react"

const HistoryPage = ({ refreshEarnings }) => {
  const [purchases, setPurchases] = useState([])
  const [search, setSearch] = useState("")
  const [filteredPurchases, setFilteredPurchases] = useState([])

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/purchase")
      if (!response.ok)
        throw new Error("Error al cargar el historial de compras.")

      let data = await response.json()
      data = data.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date))
      setPurchases(data)
      setFilteredPurchases(data)
    } catch (error) {
      console.error("Error al obtener el historial:", error)
    }
  }

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

  const handleDeletePurchase = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres borrar esta compra?"
    )
    if (!confirmDelete) return

    try {
      await fetch(`http://localhost:3000/api/purchase/${id}`, {
        method: "DELETE"
      })
      fetchPurchases()
      refreshEarnings()
    } catch (error) {
      console.error("Error al eliminar la compra:", error)
    }
  }

  const handleDeleteAllPurchases = async () => {
    if (
      !window.confirm("¿Estás seguro de que quieres borrar todo el historial?")
    )
      return

    try {
      await fetch("http://localhost:3000/api/purchase", { method: "DELETE" })
      setPurchases([])
      setFilteredPurchases([])
      refreshEarnings()
    } catch (error) {
      console.error("Error al eliminar todo el historial:", error)
    }
  }

  return (
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historial de Compras</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAllPurchases}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Borrar todo el historial
          </button>
        </div>
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
                &nbsp;
                {String(new Date(purchase.sale_date).getHours()).padStart(
                  2,
                  "0"
                )}
                :
                {String(new Date(purchase.sale_date).getMinutes()).padStart(
                  2,
                  "0"
                )}
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
              <div>
                <p>
                  {purchase.items.length}{" "}
                  {purchase.items.length === 1 ? "libro" : "libros"}
                </p>
                <p>
                  {parseFloat(purchase.total_amount).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN"
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDeletePurchase(purchase.sale_id)}
                className="text-white px-3 py-1 rounded transform transition duration-300 hover:scale-110 hover:text-red-700"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
