import { AuthLayout } from "@/components/auth/AuthLayout"
import { SignInFormWrapper } from "@/components/auth/SignInFormWrapper"

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <SignInFormWrapper />
    </AuthLayout>
  )
}

