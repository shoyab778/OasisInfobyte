"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Moon, Sun, Mic } from "lucide-react"
import type { Todo, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { AddTodoDialog } from "./add-todo-dialog"
import { TodoItem } from "./todo-item"
import { useVoiceCommands } from "@/hooks/use-voice-commands"
import { useTheme } from "next-themes"

interface TodoListProps {
  initialTodos: Todo[]
  categories: Category[]
}

export function TodoList({ initialTodos, categories }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos)
  const [search, setSearch] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { isListening, startListening, stopListening } = useVoiceCommands({
    onCommand: handleVoiceCommand,
  })

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos")
      const data = await response.json()
      setTodos(data)
    }

    const eventSource = new EventSource("/api/todos/events")
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTodos(data)
    }

    fetchTodos()

    return () => {
      eventSource.close()
    }
  }, [])

  function handleVoiceCommand(command: string) {
    if (command.includes("add")) {
      const title = command.replace("add", "").trim()
      addTodo({
        title,
        description: "",
        priority: "MEDIUM",
        dueDate: null,
      })
    } else if (command.includes("complete")) {
      const title = command.replace("complete", "").trim()
      const todo = todos.find((t) => t.title.toLowerCase() === title.toLowerCase())
      if (todo) {
        toggleTodo(todo.id)
      }
    }
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase())
    const matchesDate = selectedDate ? new Date(todo.dueDate).toDateString() === selectedDate.toDateString() : true
    return matchesSearch && matchesDate
  })

  const addTodo = async (todo: Partial<Todo>) => {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
    const newTodo = await response.json()
    setTodos([...todos, newTodo])
    router.refresh()
  }

  const toggleTodo = async (id: string) => {
    const response = await fetch(`/api/todos/${id}/toggle`, {
      method: "PATCH",
    })
    const updatedTodo = await response.json()
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    router.refresh()
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
    setTodos(todos.filter((todo) => todo.id !== id))
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Advanced Todo</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              className={`text-white ${isListening ? "bg-red-500" : ""}`}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[300px,1fr] gap-4">
          <Card className="p-4 bg-white/10 backdrop-blur-lg border-none">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="text-white" />
          </Card>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search todos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white/10 text-white placeholder:text-gray-300 border-none"
                />
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} categories={categories} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AddTodoDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={addTodo} categories={categories} />
    </div>
  )
}

