"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { File, Folder, FolderOpen, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as Y from "yjs"
import { getYDoc } from "@/lib/yjs/yjs-provider"

interface FileNode {
  path: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

interface FileTreeProps {
  workspaceId: string
  selectedFile: string | null
  onFileSelect: (filePath: string) => void
}

export function FileTree({ workspaceId, selectedFile, onFileSelect }: FileTreeProps) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  useEffect(() => {
    const doc = getYDoc(workspaceId)
    const filesMap = doc.getMap("files")

    // Load initial files from Yjs
    const loadFiles = () => {
      const fileList: FileNode[] = []
      const pathSet = new Set<string>()

      filesMap.forEach((_, key) => {
        pathSet.add(key as string)
      })

      // Build tree structure
      const tree: FileNode[] = []
      const nodeMap = new Map<string, FileNode>()

      Array.from(pathSet).forEach((path) => {
        const parts = path.split("/")
        let currentPath = ""
        
        parts.forEach((part, index) => {
          const prevPath = currentPath
          currentPath = currentPath ? `${currentPath}/${part}` : part
          
          if (!nodeMap.has(currentPath)) {
            const isFile = index === parts.length - 1
            const node: FileNode = {
              path: currentPath,
              name: part,
              type: isFile ? "file" : "folder",
              children: isFile ? undefined : [],
            }
            
            nodeMap.set(currentPath, node)
            
            if (prevPath) {
              const parent = nodeMap.get(prevPath)
              if (parent && parent.children) {
                parent.children.push(node)
              }
            } else {
              tree.push(node)
            }
          }
        })
      })

      setFiles(tree)
    }

    loadFiles()

    // Listen for changes
    const observer = () => {
      loadFiles()
    }

    filesMap.observe(observer)

    return () => {
      filesMap.unobserve(observer)
    }
  }, [workspaceId])

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleCreateFile = () => {
    // TODO: Implement file creation modal
    const fileName = prompt("Enter file name:")
    if (fileName) {
      const doc = getYDoc(workspaceId)
      const yText = doc.getText(`files/${fileName}`)
      yText.insert(0, "")
      onFileSelect(`files/${fileName}`)
    }
  }

  const renderNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedFile === node.path

    if (node.type === "folder") {
      return (
        <div key={node.path}>
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent cursor-pointer",
              level > 0 && "pl-4"
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span>{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        key={node.path}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent cursor-pointer",
          isSelected && "bg-accent font-medium",
          level > 0 && "pl-4"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onFileSelect(node.path)}
      >
        <File className="h-4 w-4" />
        <span>{node.name}</span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <span className="text-sm font-medium">Files</span>
        <Button variant="ghost" size="sm" onClick={handleCreateFile}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No files yet. Create a file to get started.
            </div>
          ) : (
            files.map((file) => renderNode(file))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

