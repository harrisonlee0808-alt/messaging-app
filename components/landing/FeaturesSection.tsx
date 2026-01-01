"use client"

import { MessageSquare, Code, Sparkles, GitBranch, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: MessageSquare,
    title: "Split-Screen Collaboration",
    description: "Chat and code side-by-side. No more switching between apps. Communicate and collaborate seamlessly.",
  },
  {
    icon: Code,
    title: "Real-Time Editing",
    description: "Multiple users can edit simultaneously with conflict-free merging. Powered by Yjs CRDT technology.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart summaries, AI-generated commit messages, and code assistance to reduce manual work.",
  },
  {
    icon: GitBranch,
    title: "Automatic Git",
    description: "Built-in version control. Changes are automatically organized with intelligent commit messages.",
  },
  {
    icon: Users,
    title: "Live Presence",
    description: "See who's online and actively editing. Shared cursors show exactly where your team is working.",
  },
  {
    icon: Zap,
    title: "Zero Setup",
    description: "Start coding immediately. No complex configuration. Just create a workspace and begin collaborating.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="container px-4 py-24 md:py-32">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl">
          Everything you need to collaborate
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          All the tools your team needs in one unified platform.
        </p>
        <div className="grid gap-6 md:grid-cols-2 mt-12 w-full max-w-4xl">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="h-full">
                <CardHeader className="space-y-3">
                  <Icon className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

