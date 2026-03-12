import { axiosClient } from './axiosClient'

export interface ChatRoom {
  id: string
  taskId: string
}

export interface ChatMessage {
  id: string
  content: string
  sentAt: string
  senderId: string
}

export const chatApi = {
  async createOrGetRoom(taskId: string) {
    const { data } = await axiosClient.post<ChatRoom>(`/chat/room/${taskId}`)
    return data
  },

  async getMessages(roomId: string) {
    const { data } = await axiosClient.get<ChatMessage[]>(
      `/chat/room/${roomId}/messages`,
    )
    return data
  },
}

