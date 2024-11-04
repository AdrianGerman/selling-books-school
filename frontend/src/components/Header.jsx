const Header = () => {
  return (
    <div className="w-full h-20 bg-[#323232] flex justify-between items-center p-6">
      <div className="flex justify-center items-center gap-2">
        <img src="./library.svg" alt="library icon" className="w-10 h-10" />
        <h1 className="text-4xl font-bold">SellBooks</h1>
      </div>
      <div className="flex items-center gap-4 text-md">
        <a href="/deudores">DEUDORES</a>
        <a href="/historial">Historial</a>
        <a href="/ingresos">$ sum ganancias x día</a>
      </div>
    </div>
  )
}

export default Header
