import { useState } from "react"

const AddBookModal = ({ onClose, onAddBook }) => {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [cycle, setCycle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !subject || !price || !stock || !cycle) {
      setError("Todos los campos son obligatorios.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          subject,
          price: parseFloat(price),
          stock: parseInt(stock),
          cycle: parseInt(cycle)
        })
      })

      if (!response.ok) {
        throw new Error("Error al agregar el libro.")
      }

      const newBook = await response.json()
      onAddBook(newBook)
      onClose()
    } catch (error) {
      console.error("Error al agregar el libro:", error)
      setError("Hubo un problema al agregar el libro.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Agregar Libro
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Título del libro"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Materia:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Materia"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Precio:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Precio"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Stock"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Semestre:</label>
            <input
              type="number"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Ciclo (1-6)"
              min="1"
              max="6"
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
