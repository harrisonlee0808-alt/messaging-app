"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSocket } from "@/hooks/useSocket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send, Sparkles } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Message {
  id: string
  content: string
  userId: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  threadId: string | null
  createdAt: Date
}

interface ChatPanelProps {
  workspaceId: string
}

export function ChatPanel({ workspaceId }: ChatPanelProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { socket, isConnected } = useSocket(workspaceId)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const userId = session?.user?.id || ""
  const userName = session?.user?.name || session?.user?.email || "User"

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error("Failed to load messages:", error)
      }
    }

    loadMessages()
  }, [workspaceId])

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message])
      scrollToBottom()
    }

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev)
        if (data.isTyping) {
          next.add(data.userId)
        } else {
          next.delete(data.userId)
        }
        return next
      })
    }

    socket.on("new-message", handleNewMessage)
    socket.on("user-typing", handleUserTyping)

    return () => {
      socket.off("new-message", handleNewMessage)
      socket.off("user-typing", handleUserTyping)
    }
  }, [socket])

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !socket || !isConnected || !userId) return

    const content = input.trim()
    setInput("")

    socket.emit("send-message", {
      workspaceId,
      userId,
      content,
    })

    // Clear typing indicator
    socket.emit("typing", { workspaceId, userId, isTyping: false })
    setIsTyping(false)
  }

  const handleTyping = (value: string) => {
    setInput(value)

    if (!socket || !isConnected || !userId) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Emit typing indicator
    if (!isTyping) {
      socket.emit("typing", { workspaceId, userId, isTyping: true })
      setIsTyping(true)
    }

    // Clear typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { workspaceId, userId, isTyping: false })
      setIsTyping(false)
    }, 3000)
  }

  const handleSummarize = async () => {
    try {
      const response = await fetch(`/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          messages: messages.map((m) => ({
            content: m.content,
            user: m.user.name || m.user.email,
          })),
        }),
      })

      if (response.ok) {
        const { summary } = await response.json()
        setSummary(summary)
        setSummaryDialogOpen(true)
      }
    } catch (error) {
      console.error("Failed to generate summary:", error)
    }
  }

  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        {messages.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSummarize}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Summarize
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.user.image || undefined} />
                <AvatarFallback>
                  {message.user.name?.[0] || message.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {message.user.name || message.user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {typingUsers.size > 0 && (
            <div className="text-sm text-muted-foreground italic">
              {typingUsers.size === 1 ? "Someone is" : "Multiple people are"} typing...
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <Button onClick={handleSend} disabled={!input.trim() || !isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="mt-2 text-xs text-muted-foreground">
            Connecting...
          </p>
        )}
      </div>

      {/* Summary Dialog */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conversation Summary</DialogTitle>
            <DialogDescription>
              AI-generated summary of the conversation
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

