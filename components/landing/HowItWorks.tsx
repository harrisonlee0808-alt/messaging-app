"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderPlus, UserPlus, Rocket } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: FolderPlus,
    title: "Create a Workspace",
    description: "Start a new workspace in seconds. No configuration needed.",
  },
  {
    number: "2",
    icon: UserPlus,
    title: "Invite Your Team",
    description: "Add team members and start collaborating immediately.",
  },
  {
    number: "3",
    icon: Rocket,
    title: "Start Collaborating",
    description: "Chat, code, and ship together. Everything syncs in real-time.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container px-4 py-24 md:py-32 bg-muted/50">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl">
          How It Works
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Get started in three simple steps.
        </p>
        <div className="grid gap-8 md:grid-cols-3 mt-12 w-full">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.number} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted opacity-20">
                    {step.number}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

