import { ResetPasswordForm } from '@/components/auth'

export function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
