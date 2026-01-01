import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WorkspaceCard } from "@/components/dashboard/WorkspaceCard"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function WorkspaceSettingsPage() {
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
    role: wm.role,
  }))

  return (
    <DashboardLayout user={session.user}>
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspace Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your workspaces and their settings
            </p>
          </div>
          <Link href="/dashboard/workspaces/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workspace
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Workspaces</CardTitle>
            <CardDescription>
              View and manage all workspaces you're a member of
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workspaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No workspaces yet</p>
                <Link href="/dashboard/workspaces/new">
                  <Button>Create Your First Workspace</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

