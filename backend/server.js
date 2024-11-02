require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

// ruta por defecto
app.get("/", (req, res) => {
  res.send(
    "Bienvenido a la API de gestión de libros escolares, si estas viendo esto es que has levantado el backend del sitio de manera correcta."
  )
})

// rutas principales
const bookRoutes = require("./routes/bookRoutes")
const studentRoutes = require("./routes/studentRoutes")
const userRoutes = require("./routes/userRoutes")

// asignación de rutas
app.use("/api/books", bookRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/users", userRoutes)

// manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" })
})

// inicar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})
