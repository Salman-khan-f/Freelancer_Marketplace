import { NavLink, Outlet } from 'react-router-dom'
import './layouts.css'

type DashboardRole = 'admin' | 'company' | 'freelancer'

interface DashboardLayoutProps {
  role: DashboardRole
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const navItems =
    role === 'admin'
      ? [
          { to: '/admin/overview', label: 'Overview' },
          { to: '/admin/users', label: 'Users' },
        ]
      : role === 'company'
        ? [
            { to: '/company/tasks', label: 'My Tasks' },
            { to: '/company/tasks/new', label: 'Create Task' },
          ]
        : [
            { to: '/freelancer/tasks', label: 'Browse Tasks' },
            { to: '/freelancer/my-bids', label: 'My Bids' },
            { to: '/freelancer/my-work', label: 'My Work' },
          ]

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">
          {role === 'admin'
            ? 'Admin'
            : role === 'company'
              ? 'Company'
              : 'Freelancer'}{' '}
          Dashboard
        </h2>
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

