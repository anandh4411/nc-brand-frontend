import { createFileRoute } from '@tanstack/react-router'
import CustomerSignUp from '@/features/auth/customer-sign-up'

export const Route = createFileRoute('/customer/sign-up')({
  component: CustomerSignUp,
})
