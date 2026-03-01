import { createFileRoute } from '@tanstack/react-router'
import VerifyEmail from '@/features/auth/verify-email'

export const Route = createFileRoute('/customer/verify-email')({
  component: VerifyEmail,
})
