import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ServiceRequestsManager from '../components/service-requests-manager'

export default async function AdminServiceRequestsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(',') || []
  if (!adminIds.includes(userId)) {
    redirect('/')
  }

  return <ServiceRequestsManager />
}
