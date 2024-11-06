import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@fontsource-variable/onest"
import "./App.css"
import AuthComponent from "./components/LoginPage"
import HomePage from "./components/HomePage"
import Header from "./components/Header"
import HistoryPage from "./components/Header/HistoryPage"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" Component={AuthComponent} />
        <Route path="/" Component={HomePage} />
        <Route path="/historial" element={<HistoryPage />} />
      </Routes>
    </Router>
  )
}

export default App
