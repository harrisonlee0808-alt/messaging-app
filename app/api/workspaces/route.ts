import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await req.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const randomSuffix = randomBytes(4).toString("hex")
    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${randomSuffix}`

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
      include: {
        members: true,
      },
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error("Error creating workspace:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

