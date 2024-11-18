import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
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
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserRole(decodedToken.role)
        setUsername(decodedToken.username || "Usuario")
      } catch (err) {
        console.error("Error al decodificar el token:", err)
        setUsername("Usuario")
        setUserRole(null)
      }
    } else {
      setUsername("Usuario")
      setUserRole(null)
    }
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
    <div className="w-full h-20 bg-[#323232] flex items-center justify-between p-4">
      <div className="relative flex items-center" ref={menuRef}>
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

      <div className="flex items-center gap-2">
        <img src={libraryIcon} alt="library icon" className="w-8 h-8" />
        <Link to={"/"}>
          <h1 className="text-3xl font-bold text-white">SellBooks</h1>
        </Link>
      </div>

      <div
        className="flex flex-col md:flex-row md:gap-2 items-center"
        ref={userMenuRef}
      >
        <Link
          className="transform transition duration-300 hover:scale-105 order-1 md:order-2"
          to="/ingresos"
        >
          {todayEarnings !== null
            ? parseFloat(todayEarnings).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
              })
            : "Cargando..."}
        </Link>

        <div className="relative order-2 md:order-1 flex items-center">
          <button
            onClick={toggleUserMenu}
            className="text-white border-white font-bold transform transition duration-300 hover:scale-105"
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
      </div>
    </div>
  )
}

export default Header
