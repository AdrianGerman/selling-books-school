import { useEffect, useState } from "react"
import AddBookModal from "./Modal/AddBook"

const Books = () => {
  const [booksByCycle, setBooksByCycle] = useState({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/books")
      if (!response.ok) {
        throw new Error("Error al cargar la lista de libros.")
      }

      const data = await response.json()

      const groupedBooks = data.reduce((acc, book) => {
        if (!acc[book.cycle]) {
          acc[book.cycle] = []
        }
        acc[book.cycle].push(book)
        return acc
      }, {})

      setBooksByCycle(groupedBooks)
    } catch (error) {
      console.error("Error al obtener la lista de libros:", error)
    }
  }

  const handleEditBook = (book) => {
    alert(`Editar libro: ${book.title}`)
  }

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este libro?"
    )
    if (!confirmDelete) return

    try {
      await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "DELETE"
      })
      fetchBooks()
    } catch (error) {
      console.error("Error al eliminar el libro:", error)
    }
  }

  const handleAddBook = (newBook) => {
    setBooksByCycle((prev) => ({
      ...prev,
      [newBook.cycle]: [...(prev[newBook.cycle] || []), newBook]
    }))
  }

  return (
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Libros</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar libro
        </button>
      </div>

      {Object.keys(booksByCycle)
        .sort()
        .map((cycle) => (
          <div key={cycle} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-200 underline mb-2">
              Semestre {cycle}
            </h2>
            <div className="space-y-2">
              {booksByCycle[cycle].map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between items-center p-3 bg-[#2d2d2d] text-white rounded-lg"
                >
                  <div>
                    <p className="font-bold">{book.title}</p>
                    <p className="text-sm text-gray-400">
                      Materia: {book.subject}
                    </p>
                    <p className="text-sm text-gray-400">
                      Precio:{" "}
                      {parseFloat(book.price).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN"
                      })}
                    </p>
                    <p className="text-sm text-gray-400">Stock: {book.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="bg-[#613BEC] text-white text-sm p-2 rounded transform transition duration-300 hover:bg-[#4c2eb7] hover:scale-105"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
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
        ))}

      {isAdding && (
        <AddBookModal
          onClose={() => setIsAdding(false)}
          onAddBook={handleAddBook}
        />
      )}
    </div>
  )
}

export default Books
