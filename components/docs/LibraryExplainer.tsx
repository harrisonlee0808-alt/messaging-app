"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

interface LibraryInfo {
  name: string
  description: string
  purpose: string
  keyFunctions: Array<{
    name: string
    description: string
    example?: string
  }>
  integration: string
}

const libraries: LibraryInfo[] = [
  {
    name: "Yjs",
    description: "A CRDT (Conflict-free Replicated Data Type) framework for building collaborative applications",
    purpose: "Enables real-time collaborative editing without conflicts. Multiple users can edit the same document simultaneously, and changes are automatically merged.",
    keyFunctions: [
      {
        name: "Y.Doc()",
        description: "Creates a new Yjs document that holds shared data types",
        example: "const doc = new Y.Doc()"
      },
      {
        name: "doc.getText(name)",
        description: "Retrieves or creates a Y.Text type for collaborative text editing",
        example: 'const yText = doc.getText("file-content")'
      },
      {
        name: "doc.getMap(name)",
        description: "Retrieves or creates a Y.Map type for key-value pairs (used for file metadata, user presence, etc.)",
        example: 'const files = doc.getMap("files")'
      },
      {
        name: "yText.toString()",
        description: "Converts Y.Text content to a regular JavaScript string",
      },
      {
        name: "yText.insert(index, text)",
        description: "Inserts text at a specific index in the shared text",
      },
      {
        name: "yText.delete(index, length)",
        description: "Deletes text from the shared text",
      },
    ],
    integration: "Used as the core data synchronization layer. Monaco Editor binds to Y.Text instances, and changes are propagated to all connected clients via WebSocket providers."
  },
  {
    name: "Monaco Editor",
    description: "The code editor that powers VS Code, providing syntax highlighting, IntelliSense, and advanced editing features",
    purpose: "Provides a professional code editing experience with syntax highlighting, autocomplete, error detection, and multi-language support.",
    keyFunctions: [
      {
        name: "MonacoEditor component",
        description: "React component that renders the Monaco editor",
        example: '<MonacoEditor height="100%" language="typescript" value={code} onChange={handleChange} />'
      },
      {
        name: "onMount(editor, monaco)",
        description: "Callback when editor is initialized, providing access to editor instance and Monaco API",
      },
      {
        name: "editor.getModel()",
        description: "Gets the current text model being edited",
      },
      {
        name: "editor.getPosition()",
        description: "Gets the current cursor position (line, column)",
      },
      {
        name: "editor.setValue(value)",
        description: "Sets the editor content programmatically",
      },
      {
        name: "monaco.languages.registerLanguage()",
        description: "Registers a custom language or configuration",
      },
    ],
    integration: "Integrated via @monaco-editor/react. Bound to Yjs Y.Text instances using y-monaco's MonacoBinding class for real-time collaboration."
  },
  {
    name: "Socket.io",
    description: "Real-time bidirectional event-based communication library using WebSockets",
    purpose: "Enables real-time messaging, typing indicators, user presence, and room-based communication for chat functionality.",
    keyFunctions: [
      {
        name: "io(url, options)",
        description: "Creates a Socket.io client connection",
        example: 'const socket = io("http://localhost:3000")'
      },
      {
        name: "socket.emit(event, data)",
        description: "Sends an event to the server",
        example: 'socket.emit("send-message", { content: "Hello" })'
      },
      {
        name: "socket.on(event, callback)",
        description: "Listens for events from the server",
        example: 'socket.on("new-message", (data) => console.log(data))'
      },
      {
        name: "socket.join(room)",
        description: "Joins a room/namespace for group communication",
      },
      {
        name: "socket.to(room).emit(event, data)",
        description: "Broadcasts an event to all clients in a room (server-side)",
      },
      {
        name: "io.on('connection', callback)",
        description: "Handles new client connections (server-side)",
      },
    ],
    integration: "Server runs in server.ts, client connects via useSocket hook. Used for chat messages, typing indicators, and workspace notifications. Each workspace is a Socket.io room."
  },
  {
    name: "isomorphic-git",
    description: "A pure JavaScript implementation of Git that works in both Node.js and browsers",
    purpose: "Enables Git operations (commit, branch, diff) without requiring Git to be installed. Used for automatic version control of workspace changes.",
    keyFunctions: [
      {
        name: "git.init({ fs, dir })",
        description: "Initializes a new Git repository",
        example: 'await git.init({ fs, dir: "./workspace" })'
      },
      {
        name: "git.add({ fs, dir, filepath })",
        description: "Stages files for commit",
        example: 'await git.add({ fs, dir: "./workspace", filepath: "." })'
      },
      {
        name: "git.commit({ fs, dir, message })",
        description: "Creates a commit with staged changes",
        example: 'await git.commit({ fs, dir: "./workspace", message: "Update files" })'
      },
      {
        name: "git.branch({ fs, dir, ref })",
        description: "Creates a new branch",
      },
      {
        name: "git.checkout({ fs, dir, ref })",
        description: "Switches to a different branch",
      },
      {
        name: "git.log({ fs, dir, depth })",
        description: "Retrieves commit history",
      },
      {
        name: "git.statusMatrix({ fs, dir })",
        description: "Gets the status of files (modified, added, deleted)",
      },
    ],
    integration: "Wrapped in GitService class. Syncs Yjs document changes to disk, then uses isomorphic-git to commit changes. AI service generates commit messages automatically."
  },
  {
    name: "Prisma",
    description: "Next-generation ORM (Object-Relational Mapping) for TypeScript and Node.js",
    purpose: "Provides type-safe database access, migrations, and query building for PostgreSQL. Ensures data integrity and simplifies database operations.",
    keyFunctions: [
      {
        name: "prisma.model.findMany()",
        description: "Queries multiple records",
        example: 'const users = await prisma.user.findMany()'
      },
      {
        name: "prisma.model.findUnique()",
        description: "Finds a unique record by ID or unique field",
        example: 'const user = await prisma.user.findUnique({ where: { id: "123" } })'
      },
      {
        name: "prisma.model.create()",
        description: "Creates a new record",
        example: 'await prisma.message.create({ data: { content: "Hello" } })'
      },
      {
        name: "prisma.model.update()",
        description: "Updates an existing record",
      },
      {
        name: "prisma.model.delete()",
        description: "Deletes a record",
      },
      {
        name: "prisma.$transaction()",
        description: "Executes multiple operations in a transaction",
      },
      {
        name: "include / select",
        description: "Includes related models or selects specific fields in queries",
        example: 'include: { user: { select: { name: true } } }'
      },
    ],
    integration: "Used throughout the app for all database operations: user authentication, workspace management, messages, file versions, git commits, and AI summaries. Schema defined in prisma/schema.prisma."
  },
  {
    name: "NextAuth.js (Auth.js)",
    description: "Complete authentication solution for Next.js applications",
    purpose: "Handles user authentication, session management, and provides secure access control. Supports multiple authentication providers (email/password, OAuth, etc.).",
    keyFunctions: [
      {
        name: "NextAuth({ providers, callbacks })",
        description: "Configures authentication providers and callbacks",
      },
      {
        name: "auth()",
        description: "Server-side function to get current session",
        example: "const session = await auth()"
      },
      {
        name: "signIn(provider, options)",
        description: "Initiates sign-in flow",
      },
      {
        name: "signOut()",
        description: "Signs out the current user",
      },
      {
        name: "useSession()",
        description: "React hook to access session in client components",
      },
      {
        name: "SessionProvider",
        description: "Context provider for session access in client components",
      },
    ],
    integration: "Configured in lib/auth.ts with Credentials provider. PrismaAdapter connects to database for user storage. Used in API routes via auth() to protect endpoints and identify users."
  },
  {
    name: "OpenAI API",
    description: "OpenAI's API for accessing large language models (GPT-4, GPT-3.5, etc.)",
    purpose: "Powers AI features: conversation summaries, code explanations, commit message generation, code suggestions, and context-aware assistance.",
    keyFunctions: [
      {
        name: "openai.chat.completions.create()",
        description: "Generates text completions using chat models",
        example: 'await openai.chat.completions.create({ model: "gpt-4", messages: [{ role: "user", content: "Hello" }] })'
      },
      {
        name: "messages array",
        description: "Array of message objects with 'role' (user/assistant/system) and 'content'",
      },
      {
        name: "max_tokens",
        description: "Maximum number of tokens in the response",
      },
      {
        name: "temperature",
        description: "Controls randomness (0-2). Lower = more focused, higher = more creative",
      },
      {
        name: "response.choices[0].message.content",
        description: "Extracts the generated text from the API response",
      },
    ],
    integration: "Wrapped in AIService class (lib/ai/ai-service.ts). Used for: summarizing conversations, generating commit messages from code diffs, explaining code, suggesting improvements, and answering code-related questions."
  },
]

export function LibraryExplainer() {
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryInfo | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Library Docs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Library Documentation</DialogTitle>
          <DialogDescription>
            Learn about the libraries and frameworks powering this application
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {libraries.map((library) => (
            <Card
              key={library.name}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedLibrary(selectedLibrary?.name === library.name ? null : library)}
            >
              <CardHeader>
                <CardTitle>{library.name}</CardTitle>
                <CardDescription>{library.description}</CardDescription>
              </CardHeader>
              {selectedLibrary?.name === library.name && (
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Purpose</h4>
                    <p className="text-sm text-muted-foreground">{library.purpose}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Functions</h4>
                    <ul className="space-y-2 text-sm">
                      {library.keyFunctions.map((func, idx) => (
                        <li key={idx} className="border-l-2 pl-3">
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">{func.name}</code>
                          <p className="mt-1 text-muted-foreground">{func.description}</p>
                          {func.example && (
                            <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                              <code>{func.example}</code>
                            </pre>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Integration in This App</h4>
                    <p className="text-sm text-muted-foreground">{library.integration}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

