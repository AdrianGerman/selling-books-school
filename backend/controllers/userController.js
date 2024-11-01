const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.getByUsername(username)

    if (user && User.validatePassword(password, user.password)) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )
      res.json({ token })
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrecta" })
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
