import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function OAuthSuccess() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
  const token = searchParams.get('token')
  if (token) {
    login(token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const redirectTo = payload.role === 'ADMIN' ? '/admin' : (localStorage.getItem('preLoginPath') || '/home')
    localStorage.removeItem('preLoginPath')
    navigate(redirectTo, { replace: true })
  } else {
    navigate('/home', { replace: true })
  }
}, [searchParams, login, navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <h1 className="text-2xl text-white">Logging you in...</h1>
    </div>
  )
}

export default OAuthSuccess