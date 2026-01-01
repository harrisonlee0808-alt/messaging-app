"use client"

import { Suspense } from "react"
import { SignInForm } from "./SignInForm"

export function SignInFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}

