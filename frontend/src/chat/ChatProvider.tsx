import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { chatApi, type ChatMessage } from '../api/chatApi'
import { useAuth } from '../context/AuthContext'

interface ChatContextValue {
  connectToRoom: (taskId: string) => Promise<string>
  disconnectFromRoom: () => void
  sendMessage: (content: string) => void
  messages: ChatMessage[]
  roomId: string | null
  connected: boolean
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? 'http://localhost:8080/ws'

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const clientRef = useRef<Client | null>(null)

  const disconnectFromRoom = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate()
      clientRef.current = null
    }
    setRoomId(null)
    setMessages([])
  }, [])

  useEffect(() => {
    return () => {
      disconnectFromRoom()
    }
  }, [disconnectFromRoom])

  const connectToRoom = useCallback(
    async (taskId: string) => {
      const room = await chatApi.createOrGetRoom(taskId)
      setRoomId(room.id)

      const sock = new SockJS(WS_BASE_URL)
      const client = new Client({
        webSocketFactory: () => sock as any,
      })

      client.onConnect = async () => {
        const history = await chatApi.getMessages(room.id)
        setMessages(history)

        client.subscribe(`/topic/room/${room.id}`, (frame: { body?: string }) => {
          const body = frame.body ? (JSON.parse(frame.body) as ChatMessage) : null
          if (body) {
            setMessages((prev) => [...prev, body])
          }
        })
      }

      client.activate()
      clientRef.current = client

      return room.id
    },
    [],
  )

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current || !clientRef.current.connected || !roomId || !user) {
        return
      }

      clientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ senderId: user.id, content }),
      })
    },
    [roomId, user],
  )

  const value: ChatContextValue = {
    connectToRoom,
    disconnectFromRoom,
    sendMessage,
    messages,
    roomId,
    connected: Boolean(clientRef.current && clientRef.current.connected),
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return ctx
}

