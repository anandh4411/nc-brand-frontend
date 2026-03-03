import { createFileRoute } from '@tanstack/react-router'
import CustomerSignIn from '@/features/auth/customer-sign-in'

export const Route = createFileRoute('/customer/sign-in')({
  component: CustomerSignIn,
})
