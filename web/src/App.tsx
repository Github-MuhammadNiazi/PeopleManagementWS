import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './scss/main.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';

function App() {
  return (
      <Routes>
        <Route path='*' element={<Navigate to='/' />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  )
}

export default App