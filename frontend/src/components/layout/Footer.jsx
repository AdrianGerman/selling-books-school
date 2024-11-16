import { Link } from "react-router-dom"

const Footer = () => {
  const userRole = localStorage.getItem("role")

  return (
    <div className="text-center font-bold mb-6 mt-6">
      <section>
        <h1>
          Designed with ♥ by AdrianGerman
          {userRole === "admin" && (
            <>
              {" · "}
              <Link to="/admin" className="cursor-pointer underline">
                Admin
              </Link>
            </>
          )}
        </h1>
      </section>
    </div>
  )
}

export default Footer
