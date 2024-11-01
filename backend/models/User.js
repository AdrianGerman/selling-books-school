const pool = require("../config/db")
const bcrypt = require("bcrypt")

const User = {
  getByUsername: async (username) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username
    ])
    return rows[0]
  },

  create: async (username, password, role) => {
    const hashedPassword = bcrypt.hashSync(password, 10)
    const [result] = await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    )
    return { id: result.insertId, username, role }
  },

  validatePassword: (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
  }
}

module.exports = User
