import { useState } from "react"

const PaymentModal = ({
  debtor,
  onClose,
  onPaymentSuccess,
  refreshEarnings
}) => {
  const [amount, setAmount] = useState("")

  const handlePay = async () => {
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      alert("Por favor, ingresa un monto válido mayor a 0.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/purchase/${debtor.sale_id}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ amountToPay: parseFloat(amount) })
        }
      )

      if (response.ok) {
        await refreshEarnings()
        alert("Pago realizado exitosamente.")
        onPaymentSuccess()
        onClose()
      } else {
        alert("Error al realizar el pago.")
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error)
      alert("Hubo un problema al procesar el pago.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#323232] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Pagar Deuda</h2>
        <div className="mb-4">
          <label className="block text-gray-300">Nombre del Estudiante:</label>
          <p className="text-lg font-semibold">{debtor.student_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Saldo pendiente:</label>
          <p className="text-lg font-semibold">
            $
            {debtor.remaining_balance.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN"
            })}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Monto a pagar:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingresa el monto"
            className="w-full p-2 border rounded bg-black text-white mt-1"
          />
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={onClose}
            className="transform transition duration-300 bg-red-500 hover:bg-red-600 hover:scale-105 text-white p-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handlePay}
            disabled={parseFloat(amount) <= 0 || isNaN(parseFloat(amount))}
            className={`transform transition duration-300 p-2 rounded text-white ${
              parseFloat(amount) > 0
                ? "bg-[#613BEC] hover:bg-[#4c2eb7] hover:scale-105"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
