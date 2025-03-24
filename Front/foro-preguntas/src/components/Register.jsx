import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

function Register(){

  const [usuario, setUsuario] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const registrarUsuario = () => {

    const nuevoUsuario = {
      user: usuario,
      email: email,
      password: password 
    }

    axios.post('/api/registro', nuevoUsuario)
      .then(res => {
        console.log(res.data)
        alert("Usuario Registrado")
        window.location.href = "/"
      })
      .catch(err => {
        console.log(err)
      })
  }

  return(
    <div className='col-lg-5 offset-lg-5 mt-5'>
      <div className='card col-sm-6'>
        <form className='m-5'>
          <h1 className='mb-4 d-flex justify-content-center'>Registro de usuario</h1>
          <div className="mb-4 row">
            <div className="col-sm-10 mx-auto">
              <input 
                type="text" 
                placeholder='Usuario' 
                className="form-control"
                onChange={(e) => setUsuario(e.target.value)}
                />
            </div>
          </div>
          <div className="mb-4 row">
            <div className="col-sm-10 mx-auto">
              <input 
                type="text" 
                placeholder='Email' 
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>
          <div className="mb-4 row">
            <div className="col-sm-10 mx-auto">
              <input 
                type="password" 
                placeholder='Contraseña' 
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>
          <div className='d-flex justify-content-center'>
            <button type='button' className='btn btn-success col-sm-6' onClick={registrarUsuario}>Registrar Usuario</button>
          </div>
          <div className='d-flex justify-content-center mt-3'>
            <Link to='/login' style={{ textDecoration: 'none'}}>
              <button className='d-flex justify-content-center btn btn-primary'>Iniciar Sesion</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register