import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CreateWorkspaceForm } from "@/components/dashboard/CreateWorkspaceForm"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function CreateWorkspacePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="container px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Workspace</h1>
          <p className="text-muted-foreground mt-2">
            Start a new collaborative workspace for your team
          </p>
        </div>
        <CreateWorkspaceForm />
      </div>
    </DashboardLayout>
  )
}
