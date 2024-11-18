import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="mb-6">Lo sentimos, no pudimos encontrar lo que buscas.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
