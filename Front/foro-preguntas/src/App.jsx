import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import Question from './components/Question';
import Questions from './components/Questions';
import Tags from './components/Tags';
import QuestionsTags from './components/QuestionsTags';
import QuestionEdit from './components/QuestionEdit';
import AnswerEdit from './components/AnswerEdit';
import AskQuestion from './components/AskQuestion';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/pregunta/:id' element={<Question/>}/>
        <Route path='/preguntas' element={<Questions/>}/>
        <Route path='/preguntaEdit/:id' element={<QuestionEdit/>}/>
        <Route path='/tags' element={<Tags/>}/>
        <Route path='/tags/:tag' element={<QuestionsTags/>} />
        <Route path='/respuestaEdit/:id' element={<AnswerEdit/>}/>
        <Route path='/preguntar' element={<AskQuestion/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registrar' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
