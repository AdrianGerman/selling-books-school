import { Routes, Route } from "react-router-dom"
import AdminPage from "../components/pages/Admin"
import Students from "../components/pages/admin/Students"
import Books from "../components/pages/admin/Books"
import Restock from "../components/pages/admin/Restock"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/estudiantes" element={<Students />} />
      <Route path="/admin/libros" element={<Books />} />
      <Route path="/admin/restock" element={<Restock />} />
    </Routes>
  )
}

export default AdminRoutes
