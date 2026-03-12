import { Link } from 'react-router-dom'

export default function CompanyTasksListPage() {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 className="dashboard-section-title">My tasks</h1>
        <Link to="/company/tasks/new" className="primary-button">
          Create task
        </Link>
      </div>
      <p>No tasks yet. Use &quot;Create task&quot; to post your first task.</p>
    </section>
  )
}

