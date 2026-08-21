import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('token', token)

        const payload = JSON.parse(atob(token.split('.')[1]))

        setUser({
          email: payload.sub,
          role: payload.role,
        })
      } catch (error) {
        console.error('Invalid token:', error)

        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }

    setLoading(false)
  }, [token])

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}