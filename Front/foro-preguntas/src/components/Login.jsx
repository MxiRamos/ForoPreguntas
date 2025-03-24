import { Link } from "react-router-dom"
import NavBar from "./Navbar"
import { useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

function Login() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const ingresarUsuario = () => {
    if (usuario === "" || password === "") {
      alert("Debe llenar los datos para poder iniciar sesión")
      return
    }

    const usuarioIngresado = { user: usuario, password: password }

    axios.post("/api/login", usuarioIngresado)
      .then(res => {
        

        // Guardar token y usuario
        localStorage.setItem("token", JSON.stringify(res.data.token))
        localStorage.setItem("usuario", usuario)

        alert("Usuario ingresado")
        window.location.href = "/"
      })
      .catch(err => {
        if (err.response?.status === 401) {
          alert("Contraseña incorrecta")
        } else if (err.response?.status === 404) {
          alert("Usuario no encontrado")
        } else {
          console.error(err)
          alert("Error al intentar iniciar sesión")
        }
      })
  }

  return (
    <div>
      <NavBar />
      <div className="col-lg-5 offset-lg-5 mt-5">
        <div className="card col-sm-6">
          <form className="m-5">
            <h1 className="mb-4 d-flex justify-content-center">Ingresá a tu cuenta</h1>
            <div className="mb-4 row">
              <div className="col-sm-10 mx-auto">
                <input 
                  type="text" 
                  placeholder="Usuario" 
                  className="form-control"
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4 row">
              <div className="col-sm-10 mx-auto">
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn btn-success col-sm-6" onClick={ingresarUsuario}>Ingresar</button>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Link to="/registrar" style={{ textDecoration: "none" }}>
                <button className="d-flex justify-content-center btn btn-primary">Registrarse</button>
              </Link>
            </div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="d-flex justify-content-center">Home</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
