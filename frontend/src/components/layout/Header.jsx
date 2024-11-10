import { Link } from "react-router-dom"

const Header = ({ todayEarnings }) => {
  return (
    <div className="w-full h-20 bg-[#323232] flex justify-between items-center p-6">
      <div className="flex justify-center items-center gap-2">
        <img src="./library.svg" alt="library icon" className="w-10 h-10" />
        <Link to={"/"}>
          <h1 className="text-4xl font-bold">SellBooks</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4 text-md">
        <Link
          className="transform transition duration-300 hover:scale-105"
          to="/deudores"
        >
          Deudores
        </Link>
        <Link
          className="transform transition duration-300 hover:scale-105"
          to="/historial"
        >
          Historial
        </Link>
        <Link
          className="transform transition duration-300 hover:scale-105"
          to="/ingresos"
        >
          {todayEarnings !== null
            ? parseFloat(todayEarnings).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
              })
            : "Cargando..."}
        </Link>
      </div>
    </div>
  )
}

export default Header
