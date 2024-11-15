import { useState } from "react"

const RestockModal = ({ book, onClose, onRestock }) => {
  const [additionalStock, setAdditionalStock] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!additionalStock || isNaN(additionalStock) || additionalStock <= 0) {
      alert("Por favor, introduce un número válido de unidades.")
      return
    }

    onRestock(book.id, parseInt(book.stock) + parseInt(additionalStock))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Re-Stock para: {book.title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Stock Actual:</label>
            <p className="text-lg font-bold">{book.stock}</p>
          </div>
          <div className="mb-4">
            <label className="block text-white">
              ¿Cuántas unidades quieres agregar?
            </label>
            <input
              type="number"
              value={additionalStock}
              onChange={(e) => setAdditionalStock(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Unidades a agregar"
            />
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="transform transition duration-300 bg-red-500 hover:bg-red-600 hover:scale-105 p-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="transform transition duration-300 bg-[#613BEC] hover:bg-[#4c2eb7] hover:scale-105 p-2 rounded"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RestockModal
