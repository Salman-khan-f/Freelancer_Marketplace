export default function AdminOverviewPage() {
  return (
    <section>
      <h1 className="dashboard-section-title">Platform overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="dashboard-card-title">Total users</p>
          <p className="dashboard-card-value">—</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-title">Active tasks</p>
          <p className="dashboard-card-value">—</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-title">In-progress projects</p>
          <p className="dashboard-card-value">—</p>
        </div>
      </div>
    </section>
  )
}

