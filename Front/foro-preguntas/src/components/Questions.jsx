import { Link, useNavigate } from "react-router-dom"
import NavBar from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

function Questions(){

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

  const formatoFecha = (fecha) => {
    if(!fecha) return "Fecha no disponible"
  
    const fechaPublicacion = new Date(fecha)
  
    if(isNaN(fechaPublicacion.getTime())) return "Fecha invalida"
  
    const ahora = new Date()
    const diferenciasHoras = (ahora - fechaPublicacion) / (1000 * 60 * 60)
  
    if(diferenciasHoras < 24) {
      return formatDistanceToNow(fechaPublicacion, { addSuffix: true, locale: es}) // hace X horas
    } else {
      return format(fechaPublicacion, "d  MMMM  yyyy") // X de X de X
    }
  }

  return(
    <div>
      <NavBar/>
      <div className="questions-container">
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
          <h1>Questions</h1>
          <div className='d-flex justify-content-center mb-4'>
            <ul className="list-group w-100">
              {preguntas.map((pregunta, index) => (
                <li className="list-group-item" key={index}>
                  <div className="votes-container">
                    <aside className="sidebarVotes">
                      <p>{pregunta.votes} Votes</p>
                      <p>{pregunta.respuestaCount} Answers</p>
                    </aside>
                    <div>
                      <Link to={`/pregunta/${pregunta._id}`}>
                        <h2>{pregunta.title}</h2>
                      </Link>
                      <p>{pregunta.body}</p>
                      {pregunta.tags.map((tag1) => (
                      <button className="btn btn-secondary" onClick={() => navigate(`/tags/${tag1}`)}>{tag1}</button>
                      ))}
                      <p>{formatoFecha(pregunta.createdAt)}</p>
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

export default Questions