import { useEffect, useState } from "react"
import RestockModal from "./Modal/Restock"

const Restock = () => {
  const [booksByCycle, setBooksByCycle] = useState({})
  const [selectedBook, setSelectedBook] = useState(null)

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

  const handleRestock = async (bookId, additionalStock) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/books/${bookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ stock: additionalStock })
        }
      )

      if (!response.ok) {
        throw new Error("Error al actualizar el stock del libro.")
      }

      const updatedBook = await response.json()
      setBooksByCycle((prev) => {
        const updatedBooks = { ...prev }
        updatedBooks[updatedBook.cycle] = updatedBooks[updatedBook.cycle].map(
          (book) => (book.id === bookId ? updatedBook : book)
        )
        return updatedBooks
      })
    } catch (error) {
      console.error("Error al actualizar el stock del libro:", error)
    }
  }

  return (
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <h1 className="text-2xl font-bold mb-4">Re-Stock de Libros</h1>

      {Object.keys(booksByCycle)
        .sort()
        .map((cycle) => (
          <div key={cycle} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-200 underline mb-4">
              Semestre {cycle}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {booksByCycle[cycle].map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-[#2d2d2d] text-white p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                >
                  <p className="font-bold">{book.title}</p>
                  <p className="text-sm text-gray-400">
                    Stock actual: {book.stock}
                  </p>
                  <p className="text-sm text-gray-400">
                    Precio:{" "}
                    {parseFloat(book.price).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN"
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

      {selectedBook && (
        <RestockModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRestock={handleRestock}
        />
      )}
    </div>
  )
}

export default Restock
