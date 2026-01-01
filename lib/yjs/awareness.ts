import * as Y from "yjs"
import { Awareness } from "y-protocols/awareness"

// Awareness helper for tracking user presence and cursors
export function createAwareness(doc: Y.Doc): Awareness {
  return new Awareness(doc)
}

export function setUserState(
  awarenessInstance: Awareness,
  userId: string,
  userName: string,
  userAvatar?: string
) {
  awarenessInstance.setLocalStateField("user", {
    id: userId,
    name: userName,
    avatar: userAvatar,
    color: getColorForUser(userId),
  })
}

export function setCursorState(
  awarenessInstance: Awareness,
  cursor: { line: number; column: number } | null
) {
  awarenessInstance.setLocalStateField("cursor", cursor)
}

export function getColorForUser(userId: string): string {
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

