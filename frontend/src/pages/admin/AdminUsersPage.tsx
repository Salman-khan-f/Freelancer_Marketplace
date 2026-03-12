const MOCK_ROWS = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'company' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'freelancer' },
]

export default function AdminUsersPage() {
  return (
    <section>
      <h1 className="dashboard-section-title">Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ROWS.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className="tag">{user.role}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

