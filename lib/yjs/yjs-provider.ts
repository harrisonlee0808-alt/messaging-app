import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

// Yjs document instance for a workspace
const docs = new Map<string, Y.Doc>()

export function getYDoc(workspaceId: string): Y.Doc {
  if (!docs.has(workspaceId)) {
    const doc = new Y.Doc()
    docs.set(workspaceId, doc)
  }
  return docs.get(workspaceId)!
}

export function createWebsocketProvider(
  workspaceId: string,
  doc: Y.Doc,
  url?: string
): WebsocketProvider {
  const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
  const provider = new WebsocketProvider(`${wsUrl}/yjs`, workspaceId, doc, {
    connect: true,
  })

  return provider
}

// Yjs text type for a file
export function getYText(doc: Y.Doc, filePath: string): Y.Text {
  const files = doc.getMap("files")
  if (!files.has(filePath)) {
    const yText = new Y.Text()
    files.set(filePath, yText)
  }
  return files.get(filePath) as Y.Text
}

// Yjs map for file metadata
export function getFileMetadata(doc: Y.Doc, filePath: string): Y.Map<any> {
  const metadata = doc.getMap("metadata")
  if (!metadata.has(filePath)) {
    const fileMeta = new Y.Map()
    metadata.set(filePath, fileMeta)
  }
  return metadata.get(filePath) as Y.Map<any>
}

