"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Folder, MoreVertical, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface WorkspaceCardProps {
  workspace: {
    id: string
    name: string
    description?: string | null
    updatedAt: Date
    memberCount?: number
  }
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{workspace.name}</CardTitle>
              {workspace.description && (
                <CardDescription className="mt-1">{workspace.description}</CardDescription>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {workspace.memberCount !== undefined && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <span>{workspace.memberCount} member{workspace.memberCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          <span>Updated {formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/workspace/${workspace.id}`} className="flex-1">
          <Button className="w-full">Open</Button>
        </Link>
        <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

