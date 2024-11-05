import { useState, useEffect } from "react"

const SelectBooksModal = ({ books, onClose, onConfirmSelection }) => {
  const [selectedBooks, setSelectedBooks] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const toggleBookSelection = (book) => {
    setSelectedBooks((prevSelected) =>
      prevSelected.includes(book)
        ? prevSelected.filter((b) => b !== book)
        : [...prevSelected, book]
    )
  }

  useEffect(() => {
    const total = selectedBooks.reduce(
      (sum, book) => sum + parseFloat(book.price || 0),
      0
    )
    setTotalAmount(total)
  }, [selectedBooks])

  const handleNext = () => {
    onConfirmSelection(selectedBooks)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Seleccionar Libros
        </h2>
        <ul className="max-h-60 overflow-y-auto">
          {books.map((book) => (
            <li
              key={book.id}
              onClick={() => toggleBookSelection(book)}
              className={`p-2 rounded cursor-pointer mb-2 ${
                selectedBooks.includes(book) ? "bg-gray-600" : "bg-gray-950"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p>Precio: ${book.price}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p className="text-center text-lg font-semibold">
            Total seleccionado: ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={onClose}
            className="transform transition duration-300 bg-red-500 hover:bg-red-600 hover:scale-105 text-white p-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleNext}
            className="transform transition duration-300 bg-[#613BEC] hover:bg-[#4c2eb7] hover:scale-105 text-white p-2 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectBooksModal
