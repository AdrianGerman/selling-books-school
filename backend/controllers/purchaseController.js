const Purchase = require("../models/Purchase")
const pool = require("../config/db")

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.getAll()
    res.json(purchases)
  } catch (error) {
    console.error("Error al obtener las compras:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.createPurchase = async (req, res) => {
  const {
    cycle,
    books, // Este es el arreglo de IDs simples
    studentName,
    studentCode,
    totalAmount,
    amountToPay,
    remainingBalance,
    isPaid
  } = req.body

  try {
    // Buscar el ID del estudiante usando su código
    const [studentRows] = await pool.query(
      "SELECT id FROM students WHERE student_code = ?",
      [studentCode]
    )
    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" })
    }
    const studentId = studentRows[0].id

    // Convertir `books` a un arreglo de objetos que incluya `book_id`, `quantity`, y `item_price`
    const formattedBooks = books.map((bookId) => ({
      book_id: bookId,
      quantity: 1, // Asumiendo que cada libro en el paquete tiene una cantidad de 1
      item_price: totalAmount / books.length // Dividiendo el precio total entre la cantidad de libros
    }))

    // Crear la compra usando el modelo `Purchase`
    const saleId = await Purchase.create(
      studentId,
      parseFloat(totalAmount),
      parseFloat(amountToPay),
      parseFloat(remainingBalance),
      isPaid,
      formattedBooks // Pasar el arreglo con el formato adecuado
    )

    res.status(201).json({
      message: "Compra realizada con éxito",
      saleId,
      totalBooks: books.length
    })
  } catch (error) {
    console.error("Error al realizar la compra:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
