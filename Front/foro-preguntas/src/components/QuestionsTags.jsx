import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import NavBar from "./Navbar"

function QuestionsTags(){
  const { tag } = useParams()
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    axios.get(`/api/preguntas?tag=${encodeURIComponent(tag)}`)
      .then((res) => {
        console.log(res.data)
        setQuestions(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }, [])

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
          <div className="content">
            <h1>{tag}</h1>
            <div className='d-flex justify-content-center mb-4'>
              <ul className="list-group w-100">
                {questions.map((question, index) => (
                  <li className="list-group-item" key={index}>
                    <Link to={`/pregunta/${question._id}`}>
                      <h2>{question.title}</h2>
                    </Link>
                    <p>{question.body}</p>
                    <p>{question.tags}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
}

export default QuestionsTags