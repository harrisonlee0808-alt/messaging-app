import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { WorkspaceCard } from "@/components/dashboard/WorkspaceCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function WorkspacesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Get all user's workspaces
  const workspaceMemberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
    },
    orderBy: {
      workspace: {
        updatedAt: "desc",
      },
    },
  })

  const workspaces = workspaceMemberships.map((wm) => ({
    id: wm.workspace.id,
    name: wm.workspace.name,
    description: wm.workspace.description,
    updatedAt: wm.workspace.updatedAt,
    memberCount: wm.workspace._count.members,
  }))

  return (
    <DashboardLayout user={session.user}>
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground mt-2">
              All your collaborative workspaces
            </p>
          </div>
          <Link href="/dashboard/workspaces/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workspace
            </Button>
          </Link>
        </div>

        {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first workspace to start collaborating
            </p>
            <Link href="/dashboard/workspaces/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Workspace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

