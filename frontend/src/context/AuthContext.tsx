import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

type Role = 'admin' | 'company' | 'freelancer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    role: Role
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const AUTH_USER_KEY = 'authUser'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const bootstrapFromStorage = useCallback(() => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedUser = window.localStorage.getItem(AUTH_USER_KEY)

    if (token && storedUser) {
      try {
        const parsedUser: AuthUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch {
        window.localStorage.removeItem(AUTH_USER_KEY)
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    bootstrapFromStorage()
  }, [bootstrapFromStorage])

  const persistSession = (params: {
    accessToken: string
    refreshToken?: string
    user: AuthUser
  }) => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken)
    if (params.refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken)
    }
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(params.user))
    setUser(params.user)
  }

  const clearSession = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    window.localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password })
    persistSession({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    })

    if (result.user.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (result.user.role === 'company') {
      navigate('/company', { replace: true })
    } else {
      navigate('/freelancer', { replace: true })
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    role: Role
  }) => {
    const result = await authApi.register(data)
    persistSession({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    })

    if (result.user.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (result.user.role === 'company') {
      navigate('/company', { replace: true })
    } else {
      navigate('/freelancer', { replace: true })
    }
  }

  const logout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export const authStorageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  authUser: AUTH_USER_KEY,
}

