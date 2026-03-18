import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/features/auth/forgot-password'

export const Route = createFileRoute('/customer/forgot-password')({
  component: ForgotPassword,
})
