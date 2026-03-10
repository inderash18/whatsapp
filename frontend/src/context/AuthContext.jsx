import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chat-user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('chat-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('chat-user')
    }
  }, [user])

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password })
      setUser(res.data)
      return res.data
    } catch (err) {
      throw err.response?.data?.error || 'Login failed'
    }
  }

  const register = async (username, password, avatar) => {
    try {
      const res = await api.post('/auth/register', { username, password, avatar })
      setUser(res.data)
      return res.data
    } catch (err) {
      throw err.response?.data?.error || 'Registration failed'
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('chat-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

