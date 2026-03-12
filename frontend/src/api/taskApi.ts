import { axiosClient } from './axiosClient'

export interface Task {
  id: string
  title: string
  description: string
  budget: number
  status: string
}

export const taskApi = {
  async listOpenTasks(page = 0, size = 10) {
    const { data } = await axiosClient.get('/tasks', {
      params: { page, size },
    })
    return data
  },

  async listCompanyTasks() {
    const { data } = await axiosClient.get<Task[]>('/tasks/company')
    return data
  },

  async listFreelancerTasks() {
    const { data } = await axiosClient.get<Task[]>('/tasks/freelancer')
    return data
  },

  async createTask(payload: {
    title: string
    description: string
    budget: number
  }) {
    const { data } = await axiosClient.post<Task>('/tasks', payload)
    return data
  },
}

