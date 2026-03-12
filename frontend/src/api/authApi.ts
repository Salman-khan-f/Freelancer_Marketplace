import { axiosClient } from './axiosClient'
import type { AuthUser } from '../context/AuthContext'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'admin' | 'company' | 'freelancer'
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>(
      '/auth/login',
      payload,
    )
    return data
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>(
      '/auth/register',
      payload,
    )
    return data
  },
}

