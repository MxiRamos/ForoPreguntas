import { Link, useNavigate, useParams } from "react-router-dom"
import NavBar from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"

function AnswerEdit(){

  const params = useParams()
  const navigate = useNavigate()
  const [respuesta, setRespuesta] = useState([])
  const [body, setBody] = useState("")
  const token = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/api/respuesta/${params.id}`)
      .then(res => {
        setRespuesta(res.data)
        setBody(res.data.body)
        console.log(res.data.body)
      })
      .catch(err => {
        console.log(err)
      })
  }, [params.id])

  const modificarRespuesta = (id) => {
    axios.put(`/api/respuesta/${id}`, {
      body: body
    }, {
      headers:{
        Authorization: token
      }
    })
      .then(res => {
        console.log(res.data)
        navigate(`/pregunta/${respuesta.question}`)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return(
    <div>
      <NavBar/>
      <div className="tags-container">
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
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Edit</h2>
          <div className="row">
            <textarea
              value={body} 
              onChange={(e) => setBody(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => modificarRespuesta(respuesta._id)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnswerEdit