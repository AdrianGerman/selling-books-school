require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

// rutas
const bookRoutes = require("./routes/bookRoutes")
const studentRoutes = require("./routes/studentRoutes")
const userRoutes = require("./routes/userRoutes")

// asignación de rutas
app.use("/api/books", bookRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/users", userRoutes)

// inicar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})
