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
    await Purchase.addDailyEarnings(amountToPay)

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

exports.deletePurchase = async (req, res) => {
  const { id } = req.params
  try {
    const purchase = await Purchase.getById(id)
    if (!purchase) {
      return res.status(404).json({ message: "Compra no encontrada" })
    }

    const amountPaid = purchase.amount_paid
    const saleDate = new Date(purchase.sale_date).toISOString().split("T")[0]

    await Purchase.deleteById(id)
    await Purchase.subtractDailyEarnings(amountPaid, saleDate)

    res.status(200).json({
      message: "Compra eliminada exitosamente y ganancias actualizadas"
    })
  } catch (error) {
    console.error("Error al eliminar la compra:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.deleteAllPurchases = async (req, res) => {
  try {
    const totalSubtracted = await Purchase.resetDailyEarnings()
    await Purchase.deleteAll()

    res.status(200).json({
      message:
        "Todas las compras y ganancias diarias han sido eliminadas exitosamente",
      totalSubtracted
    })
  } catch (error) {
    console.error("Error al eliminar todas las compras:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.getDailyEarnings = async (req, res) => {
  try {
    const earnings = await Purchase.getDailyEarnings()
    res.json(earnings)
  } catch (error) {
    console.error("Error al obtener las ganancias diarias:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.getTodayEarnings = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]
    const [result] = await pool.query(
      "SELECT daily_earnings FROM daily_earnings WHERE sale_date = ?",
      [today]
    )

    res
      .status(200)
      .json({ daily_earnings: result.length ? result[0].daily_earnings : 0 })
  } catch (error) {
    console.error("Error al obtener las ganancias de hoy:", error)
    res.status(500).json({ message: "Error al obtener las ganancias de hoy" })
  }
}

exports.payPurchase = async (req, res) => {
  const { id } = req.params
  const { amountToPay } = req.body

  try {
    const purchase = await Purchase.getById(id)
    if (!purchase) {
      return res.status(404).json({ message: "Compra no encontrada" })
    }

    const newRemainingBalance = purchase.remaining_balance - amountToPay
    const isPaid = newRemainingBalance <= 0

    await Purchase.updateBalance(id, newRemainingBalance, isPaid)
    await Purchase.addDailyEarnings(amountToPay)

    res.status(200).json({ message: "Pago realizado exitosamente" })
  } catch (error) {
    console.error("Error al realizar el pago:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
