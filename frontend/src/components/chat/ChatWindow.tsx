import { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../../chat/ChatProvider'

interface ChatWindowProps {
  taskId: string
}

export function ChatWindow({ taskId }: ChatWindowProps) {
  const { connectToRoom, sendMessage, messages } = useChatContext()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    void connectToRoom(taskId)
  }, [connectToRoom, taskId])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <div
      style={{
        borderRadius: '0.75rem',
        border: '1px solid #1f2937',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        height: '260px',
      }}
    >
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '0.5rem',
          fontSize: '0.85rem',
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: '0.25rem' }}>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderRadius: '0.5rem',
            border: '1px solid #4b5563',
            padding: '0.4rem 0.6rem',
            backgroundColor: '#020617',
            color: '#e5e7eb',
          }}
        />
        <button type="button" className="primary-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}

