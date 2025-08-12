import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await auth.getCurrentUser()
        if (error && error.message !== 'Auth session missing!') {
          throw error
        }
        setUser(user)
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (error.message !== 'Auth session missing!') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
        setSuccess(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      const { data, error } = await auth.signUp(email, password)
      if (error) throw error
      
      // Show success message for email confirmation
      if (data.user && !data.session) {
        setSuccess('Registration successful! Please check your email to verify your account before signing in.')
      }
      
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Provide more user-friendly error messages
        if (error.message === 'Email not confirmed') {
          throw new Error('请先验证您的邮箱地址。请检查您的邮箱并点击确认链接后再登录。')
        } else if (error.message === 'Invalid login credentials') {
          throw new Error('邮箱或密码错误，请检查后重试。')
        } else if (error.code === 'email_not_confirmed') {
          throw new Error('请先验证您的邮箱地址。请检查您的邮箱并点击确认链接后再登录。')
        } else {
          throw error
        }
      }
      
      setUser(data.user)
      setSuccess('登录成功！')
      return { success: true, user: data.user }
    } catch (error) {
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      const { error } = await auth.signOut()
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    success,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}