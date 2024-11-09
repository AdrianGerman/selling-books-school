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
        `
        INSERT INTO sales (student_id, sale_date, total_amount, amount_paid, remaining_balance, is_paid)
        VALUES (?, NOW(), ?, ?, ?, ?)`,
        [studentId, totalAmount, amountPaid, remainingBalance, isPaid]
      )

      const saleId = saleResult.insertId

      for (const book of books) {
        await connection.query(
          `
          INSERT INTO sale_items (sale_id, book_id, quantity, item_price)
          VALUES (?, ?, ?, ?)`,
          [saleId, book.book_id, book.quantity, book.item_price]
        )

        await connection.query(
          `
          UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?`,
          [book.quantity, book.book_id, book.quantity]
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
      ...sale,
      items: itemsBySale[sale.sale_id] || []
    }))
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      `
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
      WHERE sales.id = ?
    `,
      [id]
    )

    return rows[0] || null
  },

  addDailyEarnings: async (amountToAdd) => {
    await pool.query(
      `
      INSERT INTO daily_earnings (sale_date, daily_earnings)
      VALUES (CURDATE(), ?)
      ON DUPLICATE KEY UPDATE daily_earnings = daily_earnings + ?
    `,
      [amountToAdd, amountToAdd]
    )
  },

  subtractDailyEarnings: async (amountToSubtract, saleDate) => {
    await pool.query(
      `
      UPDATE daily_earnings
      SET daily_earnings = GREATEST(daily_earnings - ?, 0)
      WHERE sale_date = ?
    `,
      [amountToSubtract, saleDate]
    )
  },

  resetDailyEarnings: async () => {
    const [result] = await pool.query(
      `SELECT SUM(daily_earnings) AS total_subtracted FROM daily_earnings`
    )
    await pool.query(`DELETE FROM daily_earnings`)
    return result[0].total_subtracted || 0
  },

  updateBalance: async (id, remainingBalance, isPaid) => {
    await pool.query(
      `UPDATE sales SET remaining_balance = ?, is_paid = ? WHERE id = ?`,
      [remainingBalance, isPaid, id]
    )
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
  },

  getDailyEarnings: async () => {
    const [rows] = await pool.query(`
      SELECT 
        DATE(sales.sale_date) AS sale_date,
        SUM(daily_earnings) AS daily_earnings,
        SUM(sale_items.quantity) AS books_sold
      FROM sales
      JOIN sale_items ON sales.id = sale_items.sale_id
      JOIN daily_earnings ON DATE(sales.sale_date) = daily_earnings.sale_date
      GROUP BY DATE(sales.sale_date)
      ORDER BY sale_date DESC
    `)

    return rows
  }
}

module.exports = Purchase
