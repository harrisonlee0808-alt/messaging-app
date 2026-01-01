"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"

interface DashboardLayoutProps {
  children: ReactNode
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

