const pool = require("../config/db")

const Student = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM students")
    return rows
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id])
    return rows[0]
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

  update: async (id, fieldsToUpdate) => {
    const keys = Object.keys(fieldsToUpdate)
    const values = Object.values(fieldsToUpdate)

    const setClause = keys.map((key) => `${key} = ?`).join(", ")
    const sql = `UPDATE students SET ${setClause} WHERE id = ?`

    try {
      await pool.query(sql, [...values, id])
      const [updatedStudent] = await pool.query(
        "SELECT * FROM students WHERE id = ?",
        [id]
      )
      return updatedStudent[0]
    } catch (error) {
      console.error("Error en la actualización del estudiante:", error)
      throw error
    }
  },

  delete: async (id) => {
    await pool.query("DELETE FROM students WHERE id = ?", [id])
  }
}

module.exports = Student
