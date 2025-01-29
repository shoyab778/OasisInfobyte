import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const db = new PrismaClient()

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const todo = await db.todo.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json(todo)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const todo = await db.todo.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!todo) {
    return new NextResponse("Not found", { status: 404 })
  }

  const updated = await db.todo.update({
    where: {
      id: params.id,
    },
    data: {
      completed: !todo.completed,
    },
  })

  return NextResponse.json(updated)
}

