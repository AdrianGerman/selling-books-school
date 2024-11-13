import { useState } from "react"

const AddStudentForm = ({ onClose, onAddStudent }) => {
  const [name, setName] = useState("")
  const [studentCode, setStudentCode] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !studentCode.trim()) {
      setError("Por favor, completa todos los campos.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, student_code: studentCode })
      })

      if (!response.ok) {
        throw new Error("Error al agregar el estudiante.")
      }

      const newStudent = await response.json()
      onAddStudent(newStudent)
      onClose()
    } catch (error) {
      console.error("Error al agregar el estudiante:", error)
      setError("Hubo un problema al agregar el estudiante.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Agregar Estudiante
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Nombre del estudiante"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Código de Estudiante:</label>
            <input
              type="text"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Código de estudiante"
            />
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="transform transition duration-300 bg-red-500 hover:bg-red-600 hover:scale-105 p-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="transform transition duration-300 bg-[#613BEC] hover:bg-[#4c2eb7] hover:scale-105 p-2 rounded"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudentForm
