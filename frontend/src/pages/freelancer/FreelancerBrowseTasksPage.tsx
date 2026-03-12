import { Link } from 'react-router-dom'

export default function FreelancerBrowseTasksPage() {
  return (
    <section>
      <h1 className="dashboard-section-title">Browse tasks</h1>
      <p>Open tasks will appear here for bidding.</p>
      <p style={{ marginTop: '0.75rem' }}>
        Example task:{' '}
        <Link to="/freelancer/tasks/example-task-id" className="tag">
          View sample task
        </Link>
      </p>
    </section>
  )
}

