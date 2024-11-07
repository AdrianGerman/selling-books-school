const API_URL = import.meta.env.VITE_API_URL

// funcíón para registar nuevos usuarios
export const registerUser = async (username, password, role) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, role })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al registrar el usuario")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al registrar el usuario", error)
    throw error
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el inicio de sesión")
    }

    const data = await response.json()
    return data.token // Devuelve el token JWT
  } catch (error) {
    console.error("Error al iniciar sesión", error)
    throw error
  }
}
