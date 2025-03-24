import { useEffect, useState } from "react"
import NavBar from "./Navbar"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

function Home(){
  const navigate = useNavigate()

  const [preguntas, setPreguntas] = useState([])

  useEffect(() => {
    axios.get('/api/preguntas')
    .then(res => {
      setPreguntas(res.data)
      console.log(res.data)
    })
    .catch(err => {
      console.log('Error en la solicitud', err)
    })

  }, [])

  // si muestra la fecha de creacion o si fue editado mostrara la fecha que se edito
  const formatoFecha = (createdAt, updatedAt) => {
    if(!createdAt) return "Fecha no disponible"
  
    const fechaPublicacion = new Date(createdAt)
    const fechaEdicion = updatedAt ? new Date(updatedAt) : null
    const ahora = new Date()
  
    if(isNaN(fechaPublicacion.getTime())) return "Fecha invalida"
    if(fechaEdicion && isNaN(fechaEdicion.getTime())) return "Fecha de edicion invalida"
  
    const diferenciasHoras = (ahora - fechaPublicacion) / (1000 * 60 * 60)
  
    let resultado = ""

    if(diferenciasHoras < 24) {
      resultado =  `Creado ${formatDistanceToNow(fechaPublicacion, { addSuffix: true, locale: es})}` // hace X horas
    } else {
      resultado =  `Creado el ${format(fechaPublicacion, "d  MMMM  yyyy")}` // X de X de X
    }

    if(fechaEdicion && fechaEdicion > fechaPublicacion) {
      resultado += ` | Editado ${formatDistanceToNow(fechaEdicion, { addSuffix: true, locale: es})}`
    }

    return resultado
  }

  return (
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
        <h1>Bienvenido</h1>
        <button className="btn btn-primary" onClick={() => navigate('/preguntar')}>Ask Question</button>
        <div className='d-flex justify-content-center mb-4'>
          <ul className="list-group w-100">
            {preguntas.map((pregunta) => (
              <li className="list-group-item" key={pregunta._id}>
                <div className="votes-container">
                  <aside className="sidebarVotes">
                    <ul>
                      <p>{pregunta.votes} Votes</p>
                      <p>{pregunta.respuestaCount} Answers</p>
                    </ul>
                  </aside>
                  <div>
                    <Link to={`pregunta/${pregunta._id}`}>
                      <h2>{pregunta.title}</h2>
                    </Link>
                    <p>{pregunta.body}</p>
                    {pregunta.tags.map((tag1) => (
                      <button className="btn btn-secondary" onClick={() => navigate(`/tags/${tag1}`)}>{tag1}</button>
                    ))}
                    <p>{pregunta.user.user}</p>
                    <p>{formatoFecha(pregunta.createdAt, pregunta.updatedAt)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Home