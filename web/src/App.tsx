import { Routes, Route } from 'react-router-dom'
import './App.css'
import './scss/main.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/login/Login'

function About() {
  return <h1>About Page</h1>
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
  )
}

export default App