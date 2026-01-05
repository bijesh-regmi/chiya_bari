import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.post('/users/get-current-user')
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (identifier, password) => {
    // Determine if identifier is email or username
    const isEmail = identifier.includes('@')
    const payload = {
      password,
      ...(isEmail ? { email: identifier } : { username: identifier })
    }

    const response = await api.post('/users/login', payload)
    if (response.data.success) {
      setUser(response.data.data.user)
      return response.data
    }
    throw new Error(response.data.message || 'Login failed')
  }

  const register = async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.data.success) {
      // After registration, log the user in
      const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
      }
      const loginResponse = await api.post('/users/login', loginData)
      if (loginResponse.data.success) {
        setUser(loginResponse.data.data.user)
      }
      return response.data
    }
    throw new Error(response.data.message || 'Registration failed')
  }

  const logout = async () => {
    try {
      await api.post('/users/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

