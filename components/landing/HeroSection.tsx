"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Code, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container px-4 py-24 md:py-32">
      <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center">
        <div className="flex gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
          <span className="font-medium">New:</span>
          <span className="text-muted-foreground">Real-time collaborative coding is here</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Collaborate in Real-Time:
          <br />
          <span className="text-primary">Code & Chat Together</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The only platform that combines real-time messaging with collaborative code editing.
          No more switching between Slack, VS Code, and GitHub. Everything you need, in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
        <div className="relative mt-12 w-full max-w-5xl">
          <div className="rounded-lg border bg-card p-8 shadow-2xl">
            <div className="flex gap-4 h-96">
              {/* Mock chat panel */}
              <div className="w-1/3 rounded border bg-muted p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">Messages</span>
                </div>
                <div className="space-y-3 text-left">
                  <div className="text-sm">
                    <div className="font-medium">Alice</div>
                    <div className="text-muted-foreground">Let's start on the auth flow</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Bob</div>
                    <div className="text-muted-foreground">Sounds good! I'll work on the API</div>
                  </div>
                </div>
              </div>
              {/* Mock editor panel */}
              <div className="flex-1 rounded border bg-[#1e1e1e] p-4 font-mono text-sm text-green-400">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Code className="h-5 w-5" />
                  <span>workspace/auth.ts</span>
                </div>
                <pre className="text-left">
                  <code>
{`export async function signIn(
  email: string,
  password: string
) {
  // Collaborative editing
  // in real-time
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

