import { useEffect, useState } from "react"
import PurchaseModal from "../Modal/Purchase"
import BooksList from "../layout/BooksList"
import BookSelectionModal from "../Modal/BookSelection"

const HomePage = ({ refreshEarnings }) => {
  const [booksByCycle, setBooksByCycle] = useState({})
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSelectBooksModalOpen, setIsSelectBooksModalOpen] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [selectedBooks, setSelectedBooks] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalStock, setTotalStock] = useState(0)

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

        const overallStock = books.reduce((sum, book) => sum + book.stock, 0)
        setTotalStock(overallStock)
      } catch (err) {
        setError("Error al cargar los libros.")
        console.error(err)
      }
    }

    loadBooks()
  }, [])

  const updateStockAfterPurchase = (purchasedBooks) => {
    setBooksByCycle((prevBooksByCycle) => {
      const updatedBooksByCycle = { ...prevBooksByCycle }

      purchasedBooks.forEach((book) => {
        const cycle = updatedBooksByCycle[selectedCycle]
        const bookToUpdate = cycle.books.find((b) => b.id === book.id)
        if (bookToUpdate) {
          bookToUpdate.stock -= book.quantity
        }

        cycle.totalStock = cycle.books.reduce(
          (sum, book) => sum + book.stock,
          0
        )
      })

      const newTotalStock = Object.values(updatedBooksByCycle).reduce(
        (sum, cycle) => sum + cycle.totalStock,
        0
      )
      setTotalStock(newTotalStock)

      return updatedBooksByCycle
    })
  }

  const handleBuyPackage = (cycle) => {
    const selectedBooks = booksByCycle[cycle]?.books || []
    const total = selectedBooks.reduce((sum, book) => {
      const bookPrice = parseFloat(book.price) || 0
      return sum + bookPrice
    }, 0)

    setSelectedCycle(cycle)
    setSelectedBooks(selectedBooks)
    setTotalAmount(total)
    setIsModalOpen(true)
  }

  const handleSelectBooks = (cycle) => {
    setSelectedCycle(cycle)
    setIsSelectBooksModalOpen(true)
  }

  const handleConfirmSelection = (books) => {
    setSelectedBooks(books)
    const total = books.reduce(
      (sum, book) => sum + parseFloat(book.price || 0),
      0
    )
    setTotalAmount(total)
    setIsModalOpen(true)
  }

  const handleConfirmPurchase = async ({
    studentName,
    studentCode,
    amountToPay,
    remainingBalance
  }) => {
    const purchasedBooks = selectedBooks.map((book) => ({
      id: book.id,
      quantity: 1
    }))

    try {
      const response = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cycle: selectedCycle,
          books: purchasedBooks.map((book) => book.id),
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

      updateStockAfterPurchase(purchasedBooks)
      await refreshEarnings()
    } catch (err) {
      console.error(err)
      alert("Hubo un problema al realizar la compra del paquete.")
    } finally {
      setIsModalOpen(false)
      setSelectedCycle(null)
    }
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center p-4 w-full m-auto">
      <div className="self-end my-5 p-2 bg-gray-700 rounded shadow-md">
        <p className="text-md font-semibold">
          Total de libros en stock: {totalStock}
        </p>
      </div>
      {Object.keys(booksByCycle).map((cycle) => (
        <BooksList
          key={cycle}
          cycle={cycle}
          books={booksByCycle[cycle]}
          onBuyPackage={handleBuyPackage}
          onSelectBooks={handleSelectBooks}
        />
      ))}
      {isSelectBooksModalOpen && (
        <BookSelectionModal
          books={booksByCycle[selectedCycle]?.books || []}
          onClose={() => setIsSelectBooksModalOpen(false)}
          onConfirmSelection={handleConfirmSelection}
        />
      )}
      {isModalOpen && (
        <PurchaseModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmPurchase}
          totalAmount={totalAmount || 0}
        />
      )}
    </div>
  )
}

export default HomePage
