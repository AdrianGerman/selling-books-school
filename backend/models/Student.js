const pool = require("../config/db")

const Student = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM students")
    return rows
  },

  getByCode: async (student_code) => {
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE student_code = ?",
      [student_code]
    )
    return rows[0]
  },

  create: async (name, student_code) => {
    const [result] = await pool.query(
      "INSERT INTO students (name, student_code) VALUES (?, ?)",
      [name, student_code]
    )
    return { id: result.insertId, name, student_code }
  },

  delete: async (id) => {
    await pool.query("DELETE FROM students WHERE id = ?", [id])
  }
}

module.exports = Student
