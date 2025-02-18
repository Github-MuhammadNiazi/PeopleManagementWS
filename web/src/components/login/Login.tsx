import { useState } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle login logic here
    console.log('Email:', email)
    console.log('Password:', password)
  }

  return (
    <div className="login-container flex flex-column">
      <h2>Login</h2>
      <form
      className='w-100'
      onSubmit={handleSubmit}>
        <div className="form-group flex flex-row flex-justify-between">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group flex flex-row flex-justify-between">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login