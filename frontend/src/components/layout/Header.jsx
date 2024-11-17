import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import libraryIcon from "../../assets/library.svg"

const Header = ({ todayEarnings }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [username, setUsername] = useState("")

  const menuRef = useRef(null)
  const userMenuRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem("role")
    const user = localStorage.getItem("username")
    setUserRole(role)
    setUsername(user || "Usuario")
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
        setUserMenuOpen(false)
      }
    }

    if (menuOpen || userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen, userMenuOpen])

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="w-full h-20 bg-[#323232] grid grid-cols-3 items-center p-6">
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="flex items-center focus:outline-none"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white transform transition duration-300 hover:scale-105"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6l16 0" />
            <path d="M4 12l16 0" />
            <path d="M4 18l16 0" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 bg-[#000] rounded shadow-md mt-2 py-2 min-w-[150px]">
            <Link
              to="/historial"
              className="block px-4 py-2 text-white hover:bg-[#4c4c4c] transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Historial
            </Link>
            <Link
              to="/deudores"
              className="block px-4 py-2 text-white hover:bg-[#4c4c4c] transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Deudores
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin"
                className="block font-bold px-4 py-2 text-white hover:bg-[#4c4c4c] transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2">
        <img src={libraryIcon} alt="library icon" className="w-8 h-8" />
        <Link to={"/"}>
          <h1 className="text-3xl font-bold">SellBooks</h1>
        </Link>
      </div>

      <div className="flex gap-3 justify-end relative" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="text-white font-bold focus:outline-none"
          >
            {username}
          </button>
          {userMenuOpen && (
            <div className="absolute top-full right-0 bg-[#000] rounded shadow-md mt-2 py-2 min-w-[150px]">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-white hover:bg-[#4c4c4c] transition-colors duration-300 w-full text-left"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
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
