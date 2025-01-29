import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { TodoList } from "@/components/todo-list"
import { db } from "@/lib/db.server" // Updated import
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const [todos, categories] = await Promise.all([
    db.todo.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.category.findMany({
      where: {
        userId: session.user.id,
      },
    }),
  ])

  return <TodoList initialTodos={todos} categories={categories} />
}

