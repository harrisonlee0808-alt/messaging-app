"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import * as Y from "yjs"
import { MonacoBinding } from "y-monaco"
import { getYDoc, getYText, createWebsocketProvider } from "@/lib/yjs/yjs-provider"
import { FileTree } from "./FileTree"
import { CollaborationFeatures } from "./CollaborationFeatures"
import { Button } from "@/components/ui/button"
import { GitBranch, Save } from "lucide-react"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p>Loading editor...</p>
    </div>
  ),
})

interface EditorPanelProps {
  workspaceId: string
}

export function EditorPanel({ workspaceId }: EditorPanelProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const editorRef = useRef<any>(null)
  const bindingRef = useRef<MonacoBinding | null>(null)
  const providerRef = useRef<any>(null)
  const yDocRef = useRef<Y.Doc | null>(null)

  useEffect(() => {
    // Initialize Yjs document
    const doc = getYDoc(workspaceId)
    yDocRef.current = doc

    // Create WebSocket provider for Yjs
    // Note: In production, you'll need a separate WebSocket server for Yjs
    // For now, we'll use a placeholder
    // const provider = createWebsocketProvider(workspaceId, doc)
    // providerRef.current = provider

    // Cleanup on unmount
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy()
      }
      if (providerRef.current) {
        providerRef.current.destroy()
      }
    }
  }, [workspaceId])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    if (!selectedFile || !yDocRef.current) return

    // Bind Yjs text to Monaco editor
    const yText = getYText(yDocRef.current, selectedFile)
    
    try {
      const binding = new MonacoBinding(
        yText,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        editorRef.current
      )
      bindingRef.current = binding
    } catch (error) {
      console.error("Error binding Yjs to Monaco:", error)
    }
  }

  const handleFileSelect = async (filePath: string) => {
    if (bindingRef.current) {
      bindingRef.current.destroy()
      bindingRef.current = null
    }

    setSelectedFile(filePath)

    // Get content from Yjs
    if (yDocRef.current) {
      const yText = getYText(yDocRef.current, filePath)
      setFileContent(yText.toString())

      // Rebind when editor is ready
      if (editorRef.current) {
        try {
          const binding = new MonacoBinding(
            yText,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            editorRef.current
          )
          bindingRef.current = binding
        } catch (error) {
          console.error("Error binding Yjs to Monaco:", error)
        }
      }
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    setFileContent(value || "")
    // Yjs binding handles the sync automatically
  }

  // Get current user from session
  const { data: session } = useSession()
  const currentUserId = session?.user?.id || ""
  const currentUserName = session?.user?.name || session?.user?.email || "User"

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Workspace</h2>
          <Button variant="ghost" size="sm" className="gap-2">
            <GitBranch className="h-4 w-4" />
            main
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Collaboration Features */}
      {yDocRef.current && (
        <CollaborationFeatures
          workspaceId={workspaceId}
          doc={yDocRef.current}
          userId={currentUserId}
          userName={currentUserName}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r">
          <FileTree
            workspaceId={workspaceId}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Editor */}
        <div className="flex-1">
          {selectedFile ? (
            <MonacoEditor
              height="100%"
              language="typescript"
              theme="vs-dark"
              value={fileContent}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a file to start editing
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

