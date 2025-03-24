import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

function NavBar(){

  const token = localStorage.getItem('token')

  useEffect(() => {

    if(token){
      const timer = setTimeout(() => cerrarSesion(), 1000 * 60 * 60)
      return () => clearTimeout(timer)
    }

  }, [token])

  const usuario = localStorage.getItem('usuario')
  const navigate = useNavigate()

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }



  return(
    <nav className="navbar">
      {usuario ? (
        <div>
          <p>{usuario}</p>
          <button className="btn btn-primary" onClick={cerrarSesion}>Cerrar sesion</button>
        </div>
      ):(
        <div>
          <Link to='/login'>
          <button className="btn btn-primary">Login</button>
          </Link>
          <Link to='/registrar'>
            <button className="btn btn-primary">Sign un up</button>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default NavBar