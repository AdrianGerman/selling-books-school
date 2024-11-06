const pool = require("../config/db")

const Purchase = {
  create: async (
    studentId,
    totalAmount,
    amountPaid,
    remainingBalance,
    isPaid,
    books
  ) => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [saleResult] = await connection.query(
        `INSERT INTO sales (student_id, sale_date, total_amount, amount_paid, remaining_balance, is_paid)
         VALUES (?, NOW(), ?, ?, ?, ?)`,
        [studentId, totalAmount, amountPaid, remainingBalance, isPaid]
      )
      const saleId = saleResult.insertId

      for (const book of books) {
        if (!book.book_id || !book.quantity || !book.item_price) {
          throw new Error("Datos del libro incompletos")
        }

        await connection.query(
          `INSERT INTO sale_items (sale_id, book_id, quantity, item_price)
           VALUES (?, ?, ?, ?)`,
          [saleId, book.book_id, book.quantity, book.item_price]
        )
      }

      await connection.commit()
      return saleId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  getAll: async () => {
    const [salesRows] = await pool.query(`
      SELECT 
        sales.id AS sale_id,
        sales.sale_date,
        sales.total_amount,
        sales.amount_paid,
        sales.remaining_balance,
        sales.is_paid,
        students.name AS student_name,
        students.student_code
      FROM sales
      JOIN students ON sales.student_id = students.id
    `)

    const [itemsRows] = await pool.query(`
      SELECT 
        sale_items.sale_id,
        sale_items.book_id,
        sale_items.quantity,
        sale_items.item_price,
        books.title AS book_title
      FROM sale_items
      JOIN books ON sale_items.book_id = books.id
    `)

    const itemsBySale = itemsRows.reduce((acc, item) => {
      if (!acc[item.sale_id]) acc[item.sale_id] = []
      acc[item.sale_id].push({
        book_id: item.book_id,
        title: item.book_title,
        quantity: item.quantity,
        item_price: item.item_price
      })
      return acc
    }, {})

    return salesRows.map((sale) => ({
      sale_id: sale.sale_id,
      sale_date: sale.sale_date,
      total_amount: sale.total_amount,
      amount_paid: sale.amount_paid,
      remaining_balance: sale.remaining_balance,
      is_paid: sale.is_paid,
      student_name: sale.student_name,
      student_code: sale.student_code,
      items: itemsBySale[sale.sale_id] || []
    }))
  },

  getAllByDateTime: async () => {
    const [salesRows] = await pool.query(`
      SELECT 
        sales.id AS sale_id,
        sales.sale_date,
        sales.total_amount,
        sales.amount_paid,
        sales.remaining_balance,
        sales.is_paid,
        students.name AS student_name,
        students.student_code
      FROM sales
      JOIN students ON sales.student_id = students.id
      ORDER BY sales.sale_date DESC
    `)

    const [itemsRows] = await pool.query(`
      SELECT 
        sale_items.sale_id,
        sale_items.book_id,
        sale_items.quantity,
        sale_items.item_price,
        books.title AS book_title
      FROM sale_items
      JOIN books ON sale_items.book_id = books.id
    `)

    const itemsBySale = itemsRows.reduce((acc, item) => {
      if (!acc[item.sale_id]) acc[item.sale_id] = []
      acc[item.sale_id].push({
        book_id: item.book_id,
        title: item.book_title,
        quantity: item.quantity,
        item_price: item.item_price
      })
      return acc
    }, {})

    return salesRows.map((sale) => ({
      sale_id: sale.sale_id,
      sale_date: sale.sale_date,
      total_amount: sale.total_amount,
      amount_paid: sale.amount_paid,
      remaining_balance: sale.remaining_balance,
      is_paid: sale.is_paid,
      student_name: sale.student_name,
      student_code: sale.student_code,
      items: itemsBySale[sale.sale_id] || []
    }))
  },

  deleteById: async (saleId) => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      await connection.query(`DELETE FROM sale_items WHERE sale_id = ?`, [
        saleId
      ])
      await connection.query(`DELETE FROM sales WHERE id = ?`, [saleId])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  deleteAll: async () => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      await connection.query(`DELETE FROM sale_items`)
      await connection.query(`DELETE FROM sales`)

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}

module.exports = Purchase
