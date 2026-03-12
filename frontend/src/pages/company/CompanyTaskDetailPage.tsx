import { useParams } from 'react-router-dom'
import { ChatWindow } from '../../components/chat/ChatWindow'

export default function CompanyTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()

  return (
    <section>
      <h1 className="dashboard-section-title">Task detail</h1>
      <p>Task ID: {taskId}</p>
      <p>This page will show bids, assignment actions, and chat.</p>
      {taskId && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Chat</h2>
          <ChatWindow taskId={taskId} />
        </div>
      )}
    </section>
  )
}

