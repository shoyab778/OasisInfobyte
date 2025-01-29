export type Priority = "low" | "medium" | "high"

export interface Todo {
    id: string
    title: string
    description?: string
    completed: boolean
    priority: Priority
    category?: string
    dueDate?: Date
    createdAt: Date
    userId?: string
  }
  
  export interface Category {
    id: string
    name: string
    color: string
  }
  
  