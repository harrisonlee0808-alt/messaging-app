import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { aiService } from "@/lib/ai/ai-service"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId, messages } = await req.json()

    if (!workspaceId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing workspaceId or messages" },
        { status: 400 }
      )
    }

    // Verify user is member of workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: session.user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate summary
    const summary = await aiService.summarizeConversation(messages)

    // Save summary to database
    await prisma.aISummary.create({
      data: {
        workspaceId,
        userId: session.user.id,
        type: "conversation",
        content: summary,
        contextId: workspaceId,
      },
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

