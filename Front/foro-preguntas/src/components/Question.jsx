import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import NavBar from "./Navbar"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

function Question(){

  const token = JSON.parse(localStorage.getItem('token'))
  const user = localStorage.getItem('usuario')
  const params = useParams()
  const navigate = useNavigate()

  const [pregunta, setPregunta] = useState([])
  const [respuestas, setRespuestas] = useState([])
  const [usuario, setUsuario] = useState([])
  const [respuesta, setRespuesta] = useState([])

  useEffect(() => {
    axios.get(`/api/pregunta/${params.id}`)
      .then(res => {
        console.log(res.data)
        setPregunta(res.data)
      })
      .catch(err => {
        console.log(err) 
      })
  }, [params.id])

  //---
  useEffect(() => {
    if (pregunta.user){
      axios.get(`/api/usuario/${pregunta.user}`)
      .then(res => {
        setUsuario(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [pregunta.user])

  //----
  useEffect(() => {
    axios.get(`/api/preguntaRespuesta/${params.id}`)
      .then(res => {
        setRespuestas(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [params.id])

  // Agregar respuesta ------------------------------------
  const agregarRespuesta = () => {

    const respuestaUsuario = {
      body: respuesta,
      question: pregunta._id
    }

    if(usuario.user === user){
      if(respuesta === ''){
        alert('No se puede agregar una respuesta vacia')
      } else {
        axios.post('/api/respuesta', respuestaUsuario, {
          headers: {
            'Authorization': token
          }
        })
        .then(res => {
          console.log(res.data)
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
      }
    }else if(!user){
      alert("Debe iniciar sesion para realizar una respuesta")
    }
    
  }

  // verificacion de usuario para la edicion
  const editarPregunta = (preguntaId) => {
    if(usuario.user === user){
      navigate(`/preguntaEdit/${preguntaId}`)
    }else if(!user){
      alert("Debe iniciar sesion")
    }else if(user !== pregunta.user){
      alert("No es el usuario correcto")
    }
  }

  const eliminarPregunta = (id) => {
    if(usuario.user === user){
      axios.delete(`/api/pregunta/${id}`, {
        headers: {
          'Authorization': token
        }
      })
        .then(res => {
          console.log(res.data)
          window.location.href = "/"
        })
        .catch(err => {
          console.log(err)
        })
    }else if(!user){
      alert("Debe iniciar sesion")
    }else if(user !== pregunta.user){
      alert("No es el usuario correcto")
    }
    
  }

  const editarRespuesta = (respuestaId, respuestaUser) => {

    if(respuestaUser === user){
      navigate(`/respuestaEdit/${respuestaId}`)
    }else if(!user){
      alert("Debe iniciar sesion")
    }else{
      alert("No es el usuario correcto")
    }
  }

  const eliminarRespuesta = (id, respuestaUser) => {

    if(respuestaUser === user){
      axios.delete(`/api/respuesta/${id}`, {
        headers: {
          'Authorization': token
        }
      })
        .then(res => {
          console.log(res.data)
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    }else if(!user){
      alert("Debe iniciar sesion")
    }else{
      alert("No es el usuario correcto")
    }
    
  }

  //
  const voteUp = () => {
    axios.put(`/api/preguntaVoteup/${pregunta._id}`, {}, {
      headers: {'Authorization': token}
    })
    .then(res => {
      console.log(res.data)
      setPregunta(prevPregunta => ({
        ...prevPregunta,
        votes: prevPregunta.votes + 1
      }))
    })
    .catch(err => {
      if(err.response.status === 401){
        alert("Debe iniciar sesion")
      }else{
        console.log(err)
      }
    })
  }

  const voteDown = () => {
    axios.put(`/api/preguntaVotedown/${pregunta._id}`, {}, {
      headers: {Authorization: token}
    })
    .then(res => {
      //console.log(res.data)
      setPregunta(prevPregunta => ({
        ...prevPregunta,
        votes: prevPregunta.votes - 1
      }))
    })
    .catch(err => {
      if(err.response.status === 401){
        alert("Debe iniciar sesion")
      }else{
        console.log(err)
      }
    })
  }

  //
  const votoUp = (id) => {
    axios.put(`/api/respuestaVoteup/${id}`, {}, {
      headers: {Authorization: token}
    })
    .then(res => {
      //console.log(res.data)
      setRespuestas(prevRespuestas =>
        prevRespuestas.map(respuesta =>
          respuesta._id === id ? { ...respuesta, votes: respuesta.votes + 1 } : respuesta
        )
      )
    })
    .catch(err => {
      if(err.response.status === 401){
        alert("Debe iniciar sesion")
      }else{
        console.log(err)
      }
    })
  }

  const votoDown = (id) => {
    axios.put(`/api/respuestaVotedown/${id}`, {}, {
      headers: {Authorization: token}
    })
    .then(res => {
      //console.log(res.data)
      setRespuestas(prevRespuestas => 
        prevRespuestas.map(respuesta => 
          respuesta._id === id ? { ...respuesta, votes: respuesta.votes - 1 } : respuesta
        )
      )
    })
    .catch(err => {
      if(err.response.status === 401){
        alert("Debe iniciar sesion")
      }else{
        console.log(err)
      }
    })
  }

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

  return(
    <div>
      <NavBar/>
      <div className="question-container">
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
        <main className="content">
          <h1 className="question-title">{pregunta.title}</h1>
          <div className="question-body">
            <div className="question-votes">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                class="bi bi-arrow-up-square" 
                viewBox="0 0 16 16"
                onClick={voteUp}
                style={{ cursor: "pointer"}}
                >
                <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
              </svg>
              <div className="d-flex justify-content-center">
                {pregunta.votes}
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                class="bi bi-arrow-up-square" 
                viewBox="0 0 16 16"
                onClick={voteDown}
                style={{ cursor: "pointer"}}
                >
                <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark mt-2" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
              </svg>
            </div>
            <div className="question-body1">
              <p>{pregunta.body}</p>
              <button className="btn btn-secondary" onClick={() => navigate(`/tags/${pregunta.tags}`)}>{pregunta.tags}</button>
            </div>
          </div>
          <div>
            <p>{usuario.user}</p>
            <div>
              <p style={{cursor:"pointer"}} onClick={() => eliminarPregunta(pregunta._id)}>Delete</p>
              <p style={{cursor:"pointer"}} onClick={() => editarPregunta(pregunta._id)}>Edit</p>
            </div>
            <p>Asked: {formatoFecha(pregunta.createdAt, pregunta.updatedAt)}</p>
          </div>
          <h1>Answers</h1>
          {respuestas.map((respuesta) =>(
          <div className="question-answers">
            <div className="question-answer">
              <aside className="question-votes">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  fill="currentColor" 
                  class="bi bi-arrow-up-square mt-2" 
                  viewBox="0 0 16 16"
                  onClick={() => votoUp(respuesta._id)}
                  style={{ cursor: "pointer"}}
                  >
                  <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                </svg>
                <div className="d-flex justify-content-center">
                  {respuesta.votes}
                </div>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                class="bi bi-arrow-up-square"
                viewBox="0 0 16 16"
                onClick={() => votoDown(respuesta._id)}
                style={{ cursor: "pointer"}}
                >
                  <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark mt-2" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                </svg>
              </aside>
              <p>{respuesta.body}</p>
            </div>
            
            <div className="question-user">
              <p>{respuesta.user ? respuesta.user.user : 'Anónimo'}</p>
              <p style={{cursor:"pointer"}} onClick={() => eliminarRespuesta(respuesta._id, respuesta.user.user)}>Delete</p>
              <p style={{cursor:"pointer"}} onClick={() => editarRespuesta(respuesta._id, respuesta.user.user)}>Edit</p>
              <p>Answered: {formatoFecha(respuesta.createdAt, respuesta.updatedAt)}</p>
            </div>
          
          </div>
          ))}
          <div className="question-your-answer">
            <h1>Your answer</h1>
            <textarea
              className="question-input"
              type="text"
              onChange={(e) => setRespuesta(e.target.value)}
            />
            <button className="btn btn-primary" onClick={agregarRespuesta}>Post your answer</button>
          </div>
        </main>
      </div>
    </div>
    
  )
}

export default Question