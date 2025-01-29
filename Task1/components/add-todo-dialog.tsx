"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Todo, Category } from "@/types/todo"

interface AddTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (todo: Todo) => void
  categories: Category[]
}

export function AddTodoDialog({ open, onOpenChange, onAdd, categories }: AddTodoDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Todo["priority"]>("medium")
  const [category, setCategory] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const todo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      priority,
      category,
      createdAt: new Date(),
    }
    onAdd(todo)
    onOpenChange(false)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input placeholder="Todo title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Select value={priority} onValueChange={(value: Todo["priority"]) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Todo</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

