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

exports.getStudentById = async (req, res) => {
  const { id } = req.params
  try {
    const student = await Student.getById(id)
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" })
    }
    res.json(student)
  } catch (error) {
    console.error("Error al obtener el estudiante:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

exports.getStudentByCode = async (req, res) => {
  const { student_code } = req.params
  try {
    const student = await Student.getByCode(student_code)
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" })
    }
    res.json(student)
  } catch (error) {
    console.error("Error al obtener el estudiante:", error)
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

exports.updateStudent = async (req, res) => {
  const { id } = req.params
  const fieldsToUpdate = {}

  if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name
  if (req.body.student_code !== undefined)
    fieldsToUpdate.student_code = req.body.student_code

  try {
    const updatedStudent = await Student.update(id, fieldsToUpdate)
    if (!updatedStudent) {
      return res.status(404).json({ message: "Estudiante no encontrado" })
    }
    res.json(updatedStudent)
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error)
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
