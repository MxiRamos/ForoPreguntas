import { useEffect, useState } from "react"
import NavBar from "./Navbar"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"

function UpdatePassword(){

  const params = useParams()
  const navigate = useNavigate()
  const [actualPassword, setActualPass] = useState("")
  const [newPassw, setNewPass] = useState("")
  const [confirmPass, setConfimPass] = useState("")
  const token = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/api/usuario/${params.id}`)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },[])

  const modificarContraseña = () => {

    axios.patch(`/api/usuario/${params.id}/password`, {
      currentPassword: actualPassword,
      newPassword: newPassw,
      confirmPassword: confirmPass
    }, {
      headers: {
        Authorization: token
      }
    })
    .then(res => {
      alert("Contaseña actualizada")
    })
    .catch(err => {
      console.log(err)
      alert(err.response.data.error)
    })

    /*
    if(!newPassw || !confirmPass){
      alert("Debe llenar el formulario")
    }else if(password !== actualPassword){
      alert("La contaseña actual es incorrecta")
      console.log(actualPassword)
      console.log(password)
    }else{
      axios.put(`/api/usuario/${params.id}`, {
        password: newPassw,
        confirmPassword: confirmPass
      },
      {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res.data)
        alert("Contraseña actualizada")
      })
      .catch(err => {
        alert(err.response.data.error)
      })
    }*/
    
  }

  return(
    <div>
      <NavBar/>
      <div className="home-container">
        <aside className="sidebar">
          <ul>
            <Link to='/'>
              <li>Home</li>
            </Link>
            <Link to='/preguntas'>
              <li>Questions</li>
            </Link>
            <Link to='/tags'>
              <li>Tags</li>
            </Link>
          </ul>
        </aside>
        <div className="content">
          <input
            className="form-control"
            placeholder="Contraseña actual"
            type="password"
            onChange={(e) => setActualPass(e.target.value)}
          />
          <input 
            className="form-control"
            placeholder="Nueva contraseña"
            type="password"
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Confirmar contraseña"
            type="password"
            onChange={(e) => setConfimPass(e.target.value)}
          />
          <button className="btn btn-success" onClick={() => modificarContraseña()}>Cambiar contraseña</button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword