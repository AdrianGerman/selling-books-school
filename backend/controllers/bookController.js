const Book = require("../models/Book")

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAll()
    res.json(books)
  } catch (error) {
    console.error("Error al obtener los libros:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.createBook = async (req, res) => {
  const { title, subject, price, stock, cycle } = req.body
  try {
    const newBook = await Book.create(title, subject, price, stock, cycle)
    res.status(201).json(newBook)
  } catch (error) {
    console.error("Error al crear el libro:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.updateBook = async (req, res) => {
  const { id } = req.params
  const { title, subject, price, stock, cycle } = req.body
  try {
    const updatedBook = await Book.update(
      id,
      title,
      subject,
      price,
      stock,
      cycle
    )
    res.json(updatedBook)
  } catch (error) {
    console.error("Error al actualizar el libro:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.deleteBook = async (req, res) => {
  const { id } = req.params
  try {
    await Book.delete(id)
    res.status(204).send()
  } catch (error) {
    console.error("Error al eliminar el libro:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
