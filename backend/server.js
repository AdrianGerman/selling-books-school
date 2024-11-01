require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

// rutas

// inicar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})
