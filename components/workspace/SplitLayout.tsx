"use client"

import { useState, useEffect, ReactNode } from "react"
import { Separator } from "@/components/ui/separator"

interface SplitLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
  defaultLeftWidth?: number // percentage (0-100)
  minLeftWidth?: number
  minRightWidth?: number
  storageKey?: string
}

export function SplitLayout({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 40,
  minLeftWidth = 20,
  minRightWidth = 20,
  storageKey = "split-layout-width"
}: SplitLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)

  // Load saved width from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const parsed = parseFloat(saved)
      if (!isNaN(parsed) && parsed >= minLeftWidth && parsed <= 100 - minRightWidth) {
        setLeftWidth(parsed)
      }
    }
  }, [storageKey, minLeftWidth, minRightWidth])

  // Save width to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, leftWidth.toString())
  }, [leftWidth, storageKey])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const container = document.querySelector('[data-split-container]') as HTMLElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain within min/max bounds
      const constrainedWidth = Math.max(
        minLeftWidth,
        Math.min(100 - minRightWidth, newLeftWidth)
      )

      setLeftWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, minLeftWidth, minRightWidth])

  return (
    <div
      data-split-container
      className="flex h-screen w-full overflow-hidden"
    >
      {/* Left Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resize Handle */}
      <div
        className="group relative flex w-1 cursor-col-resize items-center justify-center bg-border hover:bg-primary/20 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute h-8 w-1 rounded-full bg-primary/0 group-hover:bg-primary/50 transition-colors" />
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}

