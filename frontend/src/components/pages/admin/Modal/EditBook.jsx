import { useState } from "react"

const EditBookModal = ({
  book,
  onClose,
  onEditBook,
  existingTitlesByCycle
}) => {
  const [title, setTitle] = useState(book.title)
  const [price, setPrice] = useState(book.price)
  const [stock, setStock] = useState(book.stock)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !price || !stock) {
      setError("Todos los campos son obligatorios.")
      return
    }

    const existingTitlesInCycle = existingTitlesByCycle[book.cycle] || []
    if (
      existingTitlesInCycle.includes(title.toLowerCase()) &&
      title.toLowerCase() !== book.title.toLowerCase()
    ) {
      setError("Ya existe un libro con ese título en este semestre.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/books/${book.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            price: parseFloat(price),
            stock: parseInt(stock),
            cycle: book.cycle
          })
        }
      )

      if (!response.ok) {
        throw new Error("Error al editar el libro.")
      }

      const updatedBook = await response.json()
      onEditBook(updatedBook)
      onClose()
    } catch (error) {
      console.error("Error al editar el libro:", error)
      setError("Hubo un problema al editar el libro.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Editar Libro</h2>
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
            <label className="block text-white">Precio:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Precio"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Stock:</label>
            <input
              type="number"
              value={stock}
              className="w-full p-2 border rounded opacity-40"
              placeholder="Stock"
              disabled
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal
