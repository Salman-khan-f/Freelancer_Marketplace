import { Outlet } from 'react-router-dom'
import './layouts.css'

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="auth-title">Freelancer Task Marketplace</h1>
        <Outlet />
      </div>
    </div>
  )
}

