const pool = require("../config/db")

const Book = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM books")
    return rows
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id])
    return rows[0]
  },

  create: async (title, subject, price, stock, cycle) => {
    const [result] = await pool.query(
      "INSERT INTO books (title, subject, price, stock, cycle) VALUES (?, ?, ?, ?, ?)",
      [title, subject, price, stock, cycle]
    )
    return { id: result.insertId, title, subject, price, stock, cycle }
  },

  update: async (id, title, subject, price, stock, cycle) => {
    await pool.query(
      "UPDATE books SET title = ?, subject = ?, price = ?, stock = ?, cycle = ? WHERE id = ?",
      [title, subject, price, stock, cycle, id]
    )
    return { id, title, subject, price, stock, cycle }
  },

  delete: async (id) => {
    await pool.query("DELETE FROM books WHERE id = ?", [id])
  }
}

module.exports = Book
