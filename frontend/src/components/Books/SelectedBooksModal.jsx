import { useState } from "react"

const SelectBooksModal = ({ books, onClose, onConfirmSelection }) => {
  const [selectedBooks, setSelectedBooks] = useState([])

  const toggleBookSelection = (book) => {
    setSelectedBooks((prevSelected) =>
      prevSelected.includes(book)
        ? prevSelected.filter((b) => b !== book)
        : [...prevSelected, book]
    )
  }

  const handleNext = () => {
    onConfirmSelection(selectedBooks)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Seleccionar Libros</h2>
        <ul className="max-h-60 overflow-y-auto">
          {books.map((book) => (
            <li
              key={book.id}
              onClick={() => toggleBookSelection(book)}
              className={`p-2 border rounded cursor-pointer ${
                selectedBooks.includes(book) ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p>Precio: ${book.price}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectBooksModal
