import { Route } from "react-router-dom"
import AdminPage from "../components/pages/Admin"
import Students from "../components/pages/admin/Students"
import Books from "../components/pages/admin/Books"
import Restock from "../components/pages/admin/Restock"

const adminRoutes = [
  <Route key="admin" path="/admin" element={<AdminPage />} />,
  <Route key="students" path="/admin/estudiantes" element={<Students />} />,
  <Route key="books" path="/admin/libros" element={<Books />} />,
  <Route key="restock" path="/admin/restock" element={<Restock />} />
]

export default adminRoutes
