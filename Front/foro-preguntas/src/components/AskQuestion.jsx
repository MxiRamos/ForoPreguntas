import { Link } from "react-router-dom"
import NavBar from "./Navbar"
import axios from "axios"
import { useState } from "react"

function AskQuestion(){

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const token = JSON.parse(localStorage.getItem('token'))
  const availableTags = [
    "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Swift", 
    "Ruby", "TypeScript", "Go", "Kotlin", "Rust", "Dart", "Scala"
  ]

  const handleTagChange = (e) => {
    const selectedTag = e.target.value
    if (!tags.includes(selectedTag)){
      setTags([...tags, selectedTag]) // agrega el tag si no esta repetido
    }
  }

  const eliminarTag = (tagEliminado) => {
    setTags(tags.filter(tag => tag !== tagEliminado))
  }

  const realizarPregunta = () => {
    if(tags === ""){
      alert("Seleccione un tag")
    }else{
      axios.post('/api/pregunta', {
        title: title,
        body: body,
        tags: tags
      },
        {headers: {
          Authorization: token
        }}
      )
        .then(res => {
          console.log(res.data)
          window.location.href='/'
        })
        .catch(err => {
          console.log(err)
        })
    }
    
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
          <h1>Ask a question</h1>
          <div className='justify-content-center mb-4'>
            <p>title</p>
            <input
              placeholder="Ej. "
              onChange={(e) => setTitle(e.target.value)}
            />
            <p>Detalles de tu pregunta</p>
            <input
              onChange={(e) => setBody(e.target.value)}
            />
            <p>Tags</p>
            <select className="form-select" onChange={handleTagChange}>
              <option disabled selected>Selecciona un tag</option>
              {availableTags.map((tag, index) => (
                <option key={index} value={tag}>{tag}</option>
              ))}
            </select>
            <div>
              {tags.map((tag, index) => (
                <span key={index}> 
                  {tag} <button className="btn-close" onClick={() => eliminarTag(tag)}></button>
                </span>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => realizarPregunta()}>Realizar Pregunta</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskQuestion