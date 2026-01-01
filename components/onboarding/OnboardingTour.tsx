"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Code, GitBranch, Sparkles, Users, FileText } from "lucide-react"
import { LibraryExplainer } from "@/components/docs/LibraryExplainer"

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Collaborative Workspace",
    description: "This is a split-screen workspace where you can communicate and code simultaneously",
    icon: <MessageSquare className="h-8 w-8" />,
    features: [
      "Real-time messaging on the left panel",
      "Collaborative code editor on the right panel",
      "Everything syncs automatically",
    ],
  },
  {
    id: "chat",
    title: "Real-Time Messaging",
    description: "Communicate with your team in real-time",
    icon: <MessageSquare className="h-8 w-8" />,
    features: [
      "Send messages instantly to your workspace",
      "See when others are typing",
      "Use AI to summarize long conversations",
      "Thread replies for organized discussions",
    ],
  },
  {
    id: "editor",
    title: "Collaborative Code Editor",
    description: "Edit code together with your team in real-time",
    icon: <Code className="h-8 w-8" />,
    features: [
      "Monaco Editor with syntax highlighting",
      "Multiple users can edit simultaneously",
      "Changes sync automatically using Yjs CRDTs",
      "See other users' cursors and presence",
    ],
  },
  {
    id: "git",
    title: "Automatic Git Integration",
    description: "Your edits are automatically organized with Git",
    icon: <GitBranch className="h-8 w-8" />,
    features: [
      "Auto-commit changes to Git",
      "AI-generated commit messages",
      "Branch management",
      "View commit history and diffs",
    ],
  },
  {
    id: "ai",
    title: "AI-Powered Assistance",
    description: "Let AI handle repetitive tasks",
    icon: <Sparkles className="h-8 w-8" />,
    features: [
      "Summarize conversations automatically",
      "Generate commit messages from code changes",
      "Get code explanations and suggestions",
      "Extract tasks from discussions",
    ],
  },
  {
    id: "collaboration",
    title: "Real-Time Collaboration",
    description: "Work together seamlessly",
    icon: <Users className="h-8 w-8" />,
    features: [
      "See who's online and editing",
      "Shared cursors show where others are working",
      "Changes are merged automatically (no conflicts!)",
      "File tree updates in real-time",
    ],
  },
]

interface OnboardingTourProps {
  isOpen: boolean
  onComplete: () => void
}

export function OnboardingTour({ isOpen, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)

  useEffect(() => {
    // Check if user has already completed the tour
    const completed = localStorage.getItem("onboarding-completed")
    setHasCompletedTour(completed === "true")
  }, [])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true")
    onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (hasCompletedTour && !isOpen) {
    return null
  }

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              {step.icon}
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">{step.title}</DialogTitle>
          <DialogDescription className="text-center text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-3">
            {step.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <p className="text-sm text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-8 bg-primary"
                    : idx < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {currentStep === 0 && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </DialogFooter>

        {isLastStep && (
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Want to learn more about the technologies powering this app?
            </p>
            <div className="flex justify-center">
              <LibraryExplainer />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-completed")
    if (!completed) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  return {
    showOnboarding,
    setShowOnboarding,
  }
}

