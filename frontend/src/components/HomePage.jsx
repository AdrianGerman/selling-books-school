import { useEffect, useState } from "react"

const HomePage = () => {
  const [booksByCycle, setBooksByCycle] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Llamada a la API con fetch
        const response = await fetch("http://localhost:3000/api/books")
        if (!response.ok) {
          throw new Error("Error al cargar los libros.")
        }
        const books = await response.json()

        // Agrupar los libros por ciclo
        const groupedBooks = books.reduce((acc, book) => {
          if (!acc[book.cycle]) {
            acc[book.cycle] = []
          }
          acc[book.cycle].push(book)
          return acc
        }, {})

        setBooksByCycle(groupedBooks)
      } catch (err) {
        setError("Error al cargar los libros.")
        console.error(err)
      }
    }

    loadBooks()
  }, [])

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Libros por Semestre</h1>
      {Object.keys(booksByCycle).map((cycle) => (
        <div key={cycle} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Semestre {cycle}</h2>
          <ul className="flex gap-2">
            {booksByCycle[cycle].map((book) => (
              <li
                key={book.id}
                className="p-4 border rounded shadow-sm bg-[#323232]"
              >
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p>Materia: {book.subject}</p>
                <p>Precio: ${book.price}</p>
                <p>Stock: {book.stock} unidades</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default HomePage
