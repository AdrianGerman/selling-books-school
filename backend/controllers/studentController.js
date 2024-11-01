const Student = require("../models/Student")

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.getAll()
    res.json(students)
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.createStudent = async (req, res) => {
  const { name, student_code } = req.body
  try {
    const newStudent = await Student.create(name, student_code)
    res.status(201).json(newStudent)
  } catch (error) {
    console.error("Error al crear el estudiante:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.deleteStudent = async (req, res) => {
  const { id } = req.params
  try {
    await Student.delete(id)
    res.status(204).send()
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
