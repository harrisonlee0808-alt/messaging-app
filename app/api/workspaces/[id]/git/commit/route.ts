import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { GitService } from "@/lib/git/git-service"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: workspaceId } = await params
    const { message, branch } = await req.json()

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

    const gitService = new GitService(workspaceId)
    const sha = await gitService.createCommit({
      workspaceId,
      userId: session.user.id,
      message: message || "Update files",
      branch: branch || "main",
    })

    // Save commit to database
    await prisma.gitCommit.create({
      data: {
        workspaceId,
        userId: session.user.id,
        sha,
        message: message || "Update files",
        branch: branch || "main",
        filesChanged: [], // TODO: Get from git diff
      },
    })

    return NextResponse.json({ sha, message: "Commit created successfully" })
  } catch (error) {
    console.error("Error creating commit:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

