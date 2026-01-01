"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import * as Y from "yjs"
import { Awareness } from "y-protocols/awareness"

interface CollaborationFeaturesProps {
  workspaceId: string
  doc: Y.Doc
  userId: string
  userName: string
  userAvatar?: string
}

interface Collaborator {
  clientID: number
  user: {
    id: string
    name: string
    avatar?: string
    color: string
  }
  cursor?: {
    line: number
    column: number
  }
}

export function CollaborationFeatures({
  workspaceId,
  doc,
  userId,
  userName,
  userAvatar,
}: CollaborationFeaturesProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    // Create awareness instance for presence
    const awarenessInstance = new Awareness(doc)

    // Set local user state
    awarenessInstance.setLocalStateField("user", {
      id: userId,
      name: userName,
      avatar: userAvatar,
      color: getColorForUser(userId),
    })

    // Listen for changes in awareness
    const handleAwarenessChange = () => {
      const states = awarenessInstance.getStates()
      const collaboratorList: Collaborator[] = []

      states.forEach((state, clientID) => {
        if (state.user && state.user.id !== userId) {
          collaboratorList.push({
            clientID,
            user: state.user,
            cursor: state.cursor,
          })
        }
      })

      setCollaborators(collaboratorList)
    }

    awarenessInstance.on("change", handleAwarenessChange)

    return () => {
      awarenessInstance.destroy()
    }
  }, [doc, userId, userName, userAvatar])

  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <span className="text-xs text-muted-foreground">Collaborators:</span>
      <div className="flex items-center gap-2">
        {collaborators.map((collab) => (
          <div
            key={collab.clientID}
            className="flex items-center gap-2 rounded-full border px-2 py-1"
            style={{
              borderColor: collab.user.color,
            }}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={collab.user.avatar} />
              <AvatarFallback
                className="text-xs"
                style={{
                  backgroundColor: collab.user.color,
                  color: "white",
                }}
              >
                {collab.user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{collab.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generate a consistent color for a user ID
function getColorForUser(userId: string): string {
  const colors = [
    "#ef4444", // red
    "#f59e0b", // amber
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]
  
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

