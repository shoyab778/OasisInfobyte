import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const db = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const todos = await db.todo.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(todos)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const json = await req.json()
  const todo = await db.todo.create({
    data: {
      ...json,
      userId: session.user.id,
    },
  })

  return NextResponse.json(todo)
}

