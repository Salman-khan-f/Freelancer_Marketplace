import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))

const AdminOverviewPage = lazy(() => import('../pages/admin/AdminOverviewPage'))
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))

const CompanyTasksListPage = lazy(
  () => import('../pages/company/CompanyTasksListPage'),
)
const CompanyTaskCreatePage = lazy(
  () => import('../pages/company/CompanyTaskCreatePage'),
)
const CompanyTaskDetailPage = lazy(
  () => import('../pages/company/CompanyTaskDetailPage'),
)

const FreelancerBrowseTasksPage = lazy(
  () => import('../pages/freelancer/FreelancerBrowseTasksPage'),
)
const FreelancerTaskDetailPage = lazy(
  () => import('../pages/freelancer/FreelancerTaskDetailPage'),
)
const FreelancerMyBidsPage = lazy(
  () => import('../pages/freelancer/FreelancerMyBidsPage'),
)
const FreelancerMyWorkPage = lazy(
  () => import('../pages/freelancer/FreelancerMyWorkPage'),
)

const LoadingFallback = () => <div>Loading...</div>

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Company area */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <DashboardLayout role="company" />
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyTasksListPage />} />
          <Route path="tasks" element={<CompanyTasksListPage />} />
          <Route path="tasks/new" element={<CompanyTaskCreatePage />} />
          <Route path="tasks/:taskId" element={<CompanyTaskDetailPage />} />
        </Route>

        {/* Freelancer area */}
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute allowedRoles={['freelancer']}>
              <DashboardLayout role="freelancer" />
            </ProtectedRoute>
          }
        >
          <Route index element={<FreelancerBrowseTasksPage />} />
          <Route path="tasks" element={<FreelancerBrowseTasksPage />} />
          <Route path="tasks/:taskId" element={<FreelancerTaskDetailPage />} />
          <Route path="my-bids" element={<FreelancerMyBidsPage />} />
          <Route path="my-work" element={<FreelancerMyWorkPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

