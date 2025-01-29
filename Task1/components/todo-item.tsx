import type { Todo, Category } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  categories: Category[]
}

export function TodoItem({ todo, onToggle, onDelete, categories }: TodoItemProps) {
  const category = categories.find((c) => c.id === todo.categoryId)

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-none">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
          <div className="flex-1">
            <h3 className={`font-medium text-white ${todo.completed ? "line-through opacity-70" : ""}`}>
              {todo.title}
            </h3>
            {todo.description && <p className="text-sm text-gray-300 mt-1">{todo.description}</p>}
            <div className="flex gap-2 mt-2">
              {category && <Badge style={{ backgroundColor: category.color }}>{category.name}</Badge>}
              <Badge variant={todo.priority === "HIGH" ? "destructive" : "secondary"}>
                {todo.priority.toLowerCase()}
              </Badge>
              {todo.dueDate && <Badge variant="outline">{format(new Date(todo.dueDate), "PPP")}</Badge>}
              {todo.recurring && <Badge variant="secondary">{todo.recurring.toLowerCase()}</Badge>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="text-white opacity-50 hover:opacity-100"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

