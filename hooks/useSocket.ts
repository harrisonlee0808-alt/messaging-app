"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

export function useSocket(workspaceId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!workspaceId) return

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "/", {
      path: "/api/socket",
      transports: ["websocket"],
    })

    socketInstance.on("connect", () => {
      setIsConnected(true)
      socketInstance.emit("join-workspace", workspaceId)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    socketInstance.on("joined-workspace", (id) => {
      console.log("Joined workspace:", id)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [workspaceId])

  return { socket, isConnected }
}

