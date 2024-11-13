import { useEffect, useState } from "react"
import AddStudentForm from "./Modal/AddStudent"

const Students = () => {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState("")
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/students")
      if (!response.ok) {
        throw new Error("Error al cargar la lista de estudiantes.")
      }

      const data = await response.json()
      setStudents(data)
      setFilteredStudents(data)
    } catch (error) {
      console.error("Error al obtener la lista de estudiantes:", error)
    }
  }

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    setSearch(searchTerm)

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.student_code.toString().includes(searchTerm)
    )

    setFilteredStudents(filtered)
  }

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este estudiante?"
    )
    if (!confirmDelete) return

    try {
      await fetch(`http://localhost:3000/api/students/${id}`, {
        method: "DELETE"
      })
      fetchStudents()
    } catch (error) {
      console.error("Error al eliminar el estudiante:", error)
    }
  }

  const handleEditStudent = (student) => {
    alert(`Función de edición para: ${student.name}`)
  }

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [...prev, newStudent])
    setFilteredStudents((prev) => [...prev, newStudent])
  }

  return (
    <div className="p-6 lg:w-3/4 w-auto lg:m-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Estudiantes</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar estudiante
        </button>
      </div>

      <div className="w-full flex items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre o código"
          className="w-full p-2 rounded bg-[#2d2d2d] text-white"
        />
      </div>

      <div>
        {filteredStudents.map((student, index) => (
          <div
            key={student.id}
            className={`flex justify-between items-center p-2 ${
              index % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#3a3a3a]"
            }`}
          >
            <div className="flex flex-col">
              <p className="text-lg font-bold text-white">{student.name}</p>
              <p className="text-sm text-gray-400">
                Código: {student.student_code}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditStudent(student)}
                className="bg-[#613BEC] text-white text-sm p-2 rounded transform transition duration-300 hover:bg-[#4c2eb7] hover:scale-105"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteStudent(student.id)}
                className="text-white px-3 py-1 rounded transform transition duration-300 hover:scale-110 hover:text-red-700"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <AddStudentForm
          onClose={() => setIsAdding(false)}
          onAddStudent={handleAddStudent}
        />
      )}
    </div>
  )
}

export default Students
