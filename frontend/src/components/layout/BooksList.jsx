const BooksList = ({ cycle, books, onBuyPackage, onSelectBooks }) => {
  return (
    <div className="mb-6 bg-[#323232] p-4 rounded w-full">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Semestre {cycle}</h2>
        <h2 className="font-semibold mb-4">{books.totalStock || 0} unidades</h2>
      </div>
      <ul className="flex gap-3 flex-wrap justify-center items-center">
        {books.books.map((book) => (
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
          onClick={() => onBuyPackage(cycle)}
          className="bg-[#613BEC] text-white p-2 rounded transform transition duration-300 hover:bg-[#4c2eb7] hover:scale-105"
        >
          Comprar paquete
        </button>
        <button
          onClick={() => onSelectBooks(cycle)}
          className="bg-green-500 text-white p-2 rounded transform transition duration-300 hover:bg-green-700 hover:scale-105"
        >
          Seleccionar
        </button>
      </div>
    </div>
  )
}

export default BooksList
