import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { aiService } from "@/lib/ai/ai-service"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileChanges } = await req.json()

    if (!fileChanges || !Array.isArray(fileChanges)) {
      return NextResponse.json(
        { error: "Missing fileChanges array" },
        { status: 400 }
      )
    }

    const commitMessage = await aiService.generateCommitMessage(fileChanges)

    return NextResponse.json({ commitMessage })
  } catch (error) {
    console.error("Error generating commit message:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

