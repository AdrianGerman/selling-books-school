import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@fontsource-variable/onest"
import "./App.css"
import AuthComponent from "./components/LoginPage"
import HomePage from "./components/HomePage"
import Header from "./components/Header"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" Component={AuthComponent} />
        <Route path="/" Component={HomePage} />
      </Routes>
    </Router>
  )
}

export default App
