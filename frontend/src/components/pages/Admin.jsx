import { Link } from "react-router-dom"

const AdminPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[calc(100vh-8rem)] font-bold">
      {" "}
      <div className="grid grid-cols-3 gap-5 text-center">
        <Link to="/admin/estudiantes">
          {" "}
          <div className="bg-[#323232] shadow-xl w-40 h-40 flex items-center justify-center rounded-lg transform transition duration-300 hover:scale-105 cursor-pointer">
            <p>Estudiantes</p>
          </div>
        </Link>
        <Link to="/admin/libros">
          <div className="bg-[#323232] shadow-xl w-40 h-40 flex items-center justify-center rounded-lg transform transition duration-300 hover:scale-105 cursor-pointer">
            <p>Libros</p>
          </div>
        </Link>
        <Link to="/admin/restock">
          <div className="bg-[#323232] shadow-xl w-40 h-40 flex items-center justify-center rounded-lg transform transition duration-300 hover:scale-105 cursor-pointer">
            <p>Re-stock</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminPage
