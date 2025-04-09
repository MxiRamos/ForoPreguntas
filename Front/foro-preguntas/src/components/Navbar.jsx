import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function NavBar(){

  const token = JSON.parse(localStorage.getItem('token'))
  const usuario = localStorage.getItem('usuario')
  const navigate = useNavigate()
  const [user, setUser] = useState([])

  useEffect(() => {

    if(token){
      const timer = setTimeout(() => cerrarSesion(), 1000 * 60 * 60)
      return () => clearTimeout(timer)
    }

  }, [token])

  useEffect(() => {
    axios.get('/api/usuario', {
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      //console.log(res.data)
      setUser(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  },[])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return(
    <nav className="navbar">
      {usuario ? (
        <div>
          <img src={user.profile} height="32" width="32"></img>
          <p onClick={() => navigate(`/usuario/${user._id}`)}>{usuario}</p>
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