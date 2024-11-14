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

  create: async (title, price, stock, cycle) => {
    const [result] = await pool.query(
      "INSERT INTO books (title, price, stock, cycle) VALUES (?, ?, ?, ?)",
      [title, price, stock, cycle]
    )
    return { id: result.insertId, title, price, stock, cycle }
  },

  update: async (id, fieldsToUpdate) => {
    const keys = Object.keys(fieldsToUpdate)
    const values = Object.values(fieldsToUpdate)

    const setClause = keys.map((key) => `${key} = ?`).join(", ")
    const sql = `UPDATE books SET ${setClause} WHERE id = ?`

    try {
      await pool.query(sql, [...values, id])

      const [updatedBook] = await pool.query(
        "SELECT * FROM books WHERE id = ?",
        [id]
      )
      return updatedBook[0]
    } catch (error) {
      console.error("Error en la actualización:", error)
      throw error
    }
  },

  delete: async (id) => {
    await pool.query("DELETE FROM books WHERE id = ?", [id])
  }
}

module.exports = Book
