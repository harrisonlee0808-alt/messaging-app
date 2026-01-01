"use client"

import { SplitLayout } from "@/components/workspace/SplitLayout"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { EditorPanel } from "@/components/workspace/EditorPanel"
import { OnboardingTour, useOnboarding } from "@/components/onboarding/OnboardingTour"
import { useEffect, useState } from "react"

interface WorkspacePageProps {
  params: Promise<{ id: string }>
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { showOnboarding, setShowOnboarding } = useOnboarding()
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => setWorkspaceId(id))
  }, [params])

  if (!workspaceId) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SplitLayout
        leftPanel={<ChatPanel workspaceId={workspaceId} />}
        rightPanel={<EditorPanel workspaceId={workspaceId} />}
        storageKey={`workspace-${workspaceId}-split-width`}
      />
      <OnboardingTour
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </>
  )
}
