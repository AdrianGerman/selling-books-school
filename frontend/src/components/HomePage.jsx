import { useEffect, useState } from "react"
import Modal from "./Students/PurchaseAll"

const HomePage = () => {
  const [booksByCycle, setBooksByCycle] = useState({})
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/books")
        if (!response.ok) {
          throw new Error("Error al cargar los libros.")
        }
        const books = await response.json()

        const groupedBooks = books.reduce((acc, book) => {
          if (!acc[book.cycle]) {
            acc[book.cycle] = { books: [], totalStock: 0 }
          }
          acc[book.cycle].books.push(book)
          acc[book.cycle].totalStock += book.stock
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

  const handleBuyPackage = (cycle) => {
    const selectedBooks = booksByCycle[cycle]?.books || []

    const total = selectedBooks.reduce((sum, book) => {
      const bookPrice = parseFloat(book.price) || 0
      console.log(`Precio del libro (${book.title}):`, bookPrice)
      return sum + bookPrice
    }, 0)

    console.log("Total calculado:", total)

    setSelectedCycle(cycle)
    setTotalAmount(total)
    setIsModalOpen(true)
  }

  const handleConfirmPurchase = async ({
    studentName,
    studentCode,
    amountToPay,
    remainingBalance
  }) => {
    const selectedBooks = booksByCycle[selectedCycle]?.books || []
    const bookIds = selectedBooks.map((book) => book.id)

    console.log("Total enviado:", totalAmount)

    try {
      const response = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cycle: selectedCycle,
          books: bookIds,
          studentName,
          studentCode,
          totalAmount,
          amountToPay,
          remainingBalance,
          isPaid: remainingBalance === 0
        })
      })

      if (!response.ok) {
        throw new Error("Error al realizar la compra del paquete.")
      }

      const result = await response.json()
      alert(
        `Compra exitosa para el semestre ${selectedCycle}! Total de libros comprados: ${result.totalBooks}`
      )
    } catch (err) {
      console.error(err)
      alert("Hubo un problema al realizar la compra del paquete.")
    } finally {
      setIsModalOpen(false)
      setSelectedCycle(null)
    }
  }

  const handleSelectBooks = (cycle) => {
    console.log("Seleccionar libros del semestre:", cycle)
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col justify-center items-center my-6 p-4">
      {Object.keys(booksByCycle).map((cycle) => (
        <div key={cycle} className="mb-6 bg-[#323232] p-4 rounded">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">Semestre {cycle}</h2>
            <h2 className="font-semibold mb-4">
              {booksByCycle[cycle]?.totalStock || 0} unidades
            </h2>
          </div>
          <ul className="flex gap-3 flex-wrap justify-center items-center">
            {(booksByCycle[cycle]?.books || []).map((book) => (
              <li
                key={book.id}
                className="p-4 border rounded shadow-sm bg-[#323232] text-white w-56 flex flex-col justify-between transform transition duration-200 hover:scale-105"
              >
                <div>
                  <h3 className="text-lg font-bold">{book.title}</h3>
                </div>
                <div>
                  <p>Precio: ${book.price}</p>
                  <p>Stock: {book.stock} unidades</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => handleBuyPackage(cycle)}
              className="bg-[#613BEC] text-white p-2 rounded transform transition duration-300 hover:bg-[#4c2eb7] hover:scale-105"
            >
              Comprar paquete
            </button>
            <button
              onClick={() => handleSelectBooks(cycle)}
              className="bg-green-500 text-white p-2 rounded transform transition duration-300 hover:bg-green-700 hover:scale-105"
            >
              Seleccionar
            </button>
          </div>
        </div>
      ))}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmPurchase}
          totalAmount={totalAmount || 0} // Aseguramos que sea numérico
        />
      )}
    </div>
  )
}

export default HomePage
