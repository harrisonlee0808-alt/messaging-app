import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { prisma } from "./prisma"

let io: SocketIOServer | null = null

export function initializeSocket(server: HTTPServer) {
  if (io) {
    return io
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socket",
  })

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id)

    // Join workspace room
    socket.on("join-workspace", async (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`)
      socket.emit("joined-workspace", workspaceId)

      // Notify others in the workspace
      socket.to(`workspace:${workspaceId}`).emit("user-joined", {
        userId: socket.id, // In production, use actual user ID from auth
      })
    })

    // Leave workspace room
    socket.on("leave-workspace", (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`)
      socket.to(`workspace:${workspaceId}`).emit("user-left", {
        userId: socket.id,
      })
    })

    // Send message
    socket.on(
      "send-message",
      async (data: {
        workspaceId: string
        userId: string
        content: string
        threadId?: string
      }) => {
        try {
          // Save message to database
          const message = await prisma.message.create({
            data: {
              workspaceId: data.workspaceId,
              userId: data.userId,
              content: data.content,
              threadId: data.threadId || null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          })

          // Broadcast to all in workspace
          io?.to(`workspace:${data.workspaceId}`).emit("new-message", message)
        } catch (error) {
          console.error("Error sending message:", error)
          socket.emit("message-error", { error: "Failed to send message" })
        }
      }
    )

    // Typing indicator
    socket.on(
      "typing",
      (data: { workspaceId: string; userId: string; isTyping: boolean }) => {
        socket.to(`workspace:${data.workspaceId}`).emit("user-typing", {
          userId: data.userId,
          isTyping: data.isTyping,
        })
      }
    )

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  return io
}

export function getIO(): SocketIOServer | null {
  return io
}

