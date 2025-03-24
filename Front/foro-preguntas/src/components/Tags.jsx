import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";

function TagsList(){
  const [tags, setTags] = useState([]);
  const navigate = useNavigate()
  const availableTags = [{
    name: "Javascript",
    description: "JavaScript (a dialect of ECMAScript) is a high-level, multi-paradigm, object-oriented, prototype-based, dynamically-typed, and interpreted language traditionally used for client-side scripting in web browsers.",
  },{
    name: "Python",
    description: "Python is an interpreted, interactive, object-oriented (using classes), dynamic and strongly typed programming language that is used for a wide range of applications."
  },
  {
    name: "Java",
    description: "Java is a high-level, platform-independent, object-oriented, functional programming language and runtime environment"
  },
  {
    name: "C++",
    description: "C++ is a (mostly) statically-typed, free-form, (usually) compiled, multi-paradigm, intermediate-level general-purpose programming language; not to be confused with C or C++/CLI."
  },
  {
    name: "C#",
    description: "c# is a multi-paradigm programming language including object-oriented programming, functional programming, and imperative programming created by Microsoft in conjunction with .NET."
  },
  {
    name: "PHP",
    description: "PHP is a widely used, open source, general-purpose, multi-paradigm, dynamically typed and interpreted scripting language designed initially for server-side web development."
  },
  {
    name: "Swift",
    description: "Swift is an application and systems programming language introduced by Apple on June 2, 2014, and distributed as open source."
  },
  {
    name: "Ruby",
    description: "Ruby is a multi-platform open-source, dynamic object-oriented interpreted language that combines concepts from Perl, Smalltalk, and Lisp. Ruby focuses on simplicity and productivity."
  },
  {
    name: "TypeScript",
    description: "TypeScript is a typed superset of javascript that transpiles to plain JavaScript."
  },
  {
    name: "Go",
    description: "Go (sometimes Golang for search-ability) is a general-purpose programming language."
  },
  {
    name: "Kotlin",
    description: "Kotlin is a concise multiplatform language developed by JetBrains and Contributors."
  },
  {
    name: "Rust",
    description: "Rust is a systems programming language focused on three goals: safety, speed, and concurrency."
  },
  {
    name: "Dart",
    description: "Dart is an open-source, class-based, statically (and strongly)-typed (with inference) programming language for building web and mobile applications created by Google."
  }]

  useEffect(() => {
    axios.get("http://localhost:5000/api/tags")
      .then(res => {
        setTags(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
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
      <h2 className="text-xl font-semibold mb-3">Tags Populares</h2>
        <div className="row">
          {availableTags.map((tag, index) => (
            <div className="col-md-6 mb-4">
              <div key={index} className="card">
                <div className="card-body">
                  <h5 className="card-title" onClick={() => navigate(`/tags/${tag.name}`)} style={{cursor:"pointer"}}>{tag.name}</h5>
                  <p className="card-text">{tag.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default TagsList
