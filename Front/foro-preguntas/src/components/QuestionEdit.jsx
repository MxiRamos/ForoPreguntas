import { Link, useNavigate, useParams } from "react-router-dom"
import NavBar from "./Navbar"
import { useEffect, useState } from "react"
import axios from "axios"

function QuestionEdit(){

  const params = useParams()
  const navigate = useNavigate()
  const [pregunta, setPregunta] = useState([])
  const [titulo, setTitulo] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const token = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/api/pregunta/${params.id}`)
      .then(res => {
        setPregunta(res.data)
        setTitulo(res.data.title)
        setBody(res.data.body)
        setTags(res.data.tags)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [params.id])

  const modificarPregunta = (id) => {
    axios.put(`/api/pregunta/${id}`, {
      title: titulo,
      body: body,
      tags: tags
    },{
      headers: {
        Authorization: token
      }
    })
    .then(res => {
      console.log(res.data)
      navigate(`/pregunta/${pregunta._id}`)
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
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
              value={body} 
              onChange={(e) => setBody(e.target.value)}
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => modificarPregunta(pregunta._id)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionEdit