import { useState, useEffect } from "react"

const PurchaseAll = ({ onClose, onConfirm, totalAmount }) => {
  const [studentName, setStudentName] = useState("")
  const [studentCode, setStudentCode] = useState("")
  const [amountToPay, setAmountToPay] = useState(totalAmount)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    const fetchStudentName = async () => {
      if (studentCode.trim().length !== 9) {
        setStudentName("")
        setError(null)
        return
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/students/code/${studentCode}`
        )
        if (!response.ok) {
          if (response.status === 404) {
            setError("Estudiante no encontrado")
            setStudentName("")
            throw new Error("Error al buscar el estudiante")
          }
          return
        }

        const student = await response.json()
        setStudentName(student.name)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Error al obtener el estudiante")
      }
    }

    fetchStudentName()
  }, [studentCode])

  const handleConfirm = () => {
    if (!studentName.trim() || !studentCode.trim()) {
      alert("Por favor, completa todos los campos.")
      return
    }

    const remainingBalance = totalAmount - amountToPay

    onConfirm({ studentName, studentCode, amountToPay, remainingBalance })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">
          Información del comprador
        </h2>
        <div className="mb-4">
          <label className="block">Código de Estudiante:</label>
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Ingresa el código"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block">Nombre del Estudiante:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 border rounded mt-1 opacity-40"
            placeholder="Nombre del estudiante"
            disabled
          />
        </div>
        <div className="mb-4">
          <p>
            Monto total del paquete: <strong>${totalAmount.toFixed(2)}</strong>
          </p>
          <label className="block">Monto a pagar ahora:</label>
          <input
            type="number"
            value={amountToPay}
            onChange={(e) => setAmountToPay(parseFloat(e.target.value))}
            className="w-full p-2 border rounded mt-1"
            placeholder="Monto a pagar"
          />
        </div>
        <div className="mb-4">
          <p>
            Balance pendiente:{" "}
            <strong>${(totalAmount - amountToPay).toFixed(2)}</strong>
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={onClose}
            className="transform transition duration-300 bg-red-500 hover:bg-red-600 hover:scale-105 p-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="transform transition duration-300 bg-[#613BEC] hover:bg-[#4c2eb7] hover:scale-105 p-2 rounded"
          >
            Confirmar compra
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseAll
