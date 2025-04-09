import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import NavBar from "./Navbar"

function User(){

  const token = JSON.parse(localStorage.getItem('token'))
  const[usuario, setUsuario] = useState([])
  const[user, setUser] = useState("")
  const[email, setEmail] = useState("")
  const[imagen, setImagen] = useState("")
  const params = useParams()
  const navigate = useNavigate()

  useEffect(()=> {
    axios.get(`/api/usuario/${params.id}`)
      .then(res => {
        setUsuario(res.data)
        setUser(res.data.user)
        setEmail(res.data.email)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },[])

  const subirImagen = () => {
    const formData = new FormData()
    formData.append("user", user)
    formData.append("email", email)
    formData.append("profile", imagen)

    axios.put(`/api/usuario/${params.id}`, formData,
    {
      headers: {
        Authorization: token
      }
    })
    .then(res => {
      console.log(res.data)
      localStorage.setItem("usuario", user)
      window.location.reload()
    })
    .catch(err => {
      console.log(err)
    })
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
          <div className="container">
            <img src={usuario.profile} height="64"/>
            <p>User</p>
            <input 
              type="text"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <p>Email address</p>
            <input
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>Profile</p>
            <input type="file" onChange={(e) => setImagen(e.target.files[0])}/>
            <button className="btn btn-success" onClick={() => subirImagen()}>Modificar usuario</button>
            <button className="btn btn-danger" onClick={() => navigate(`/update-password/${usuario._id}`)}>Modificar contraseña</button>
          </div>
        </div>
    </div>
  )
}

export default User