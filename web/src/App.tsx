import { Routes, Route } from 'react-router-dom'
import './App.css'
import './scss/main.scss'
import Login from './components/login/Login'

function About() {
  return <h1>About Page</h1>
}

function App() {
  return (
    <div style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App