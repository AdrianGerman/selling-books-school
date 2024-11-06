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
    books,
    studentName,
    studentCode,
    totalAmount,
    amountToPay,
    remainingBalance,
    isPaid
  } = req.body

  try {
    const [studentRows] = await pool.query(
      "SELECT id FROM students WHERE student_code = ?",
      [studentCode]
    )
    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" })
    }
    const studentId = studentRows[0].id

    const formattedBooks = books.map((bookId) => ({
      book_id: bookId,
      quantity: 1,
      item_price: totalAmount / books.length
    }))

    const saleId = await Purchase.create(
      studentId,
      parseFloat(totalAmount),
      parseFloat(amountToPay),
      parseFloat(remainingBalance),
      isPaid,
      formattedBooks
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

exports.getAllPurchasesByDateTime = async (req, res) => {
  try {
    const purchases = await Purchase.getAllByDateTime()
    res.json(purchases)
  } catch (error) {
    console.error("Error al obtener las compras:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.deletePurchase = async (req, res) => {
  const { id } = req.params
  try {
    await Purchase.deleteById(id)
    res.status(200).json({ message: "Compra eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar la compra:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.deleteAllPurchases = async (req, res) => {
  try {
    await Purchase.deleteAll()
    res
      .status(200)
      .json({ message: "Todas las compras han sido eliminadas exitosamente" })
  } catch (error) {
    console.error("Error al eliminar todas las compras:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
