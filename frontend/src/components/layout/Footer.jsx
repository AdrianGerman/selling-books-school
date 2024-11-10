import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <>
      <div className="p-4 text-center font-bold my-7">
        <section>
          <h1>
            Designed with ♥ by AdrianGerman ·{" "}
            <Link to="/admin" className="cursor-pointer underline">
              Admin
            </Link>
          </h1>
        </section>
      </div>
    </>
  )
}

export default Footer
