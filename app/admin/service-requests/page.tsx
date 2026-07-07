import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ServiceRequestsManager from '../components/service-requests-manager'
import { isAdminUser } from '@/lib/admin'

export default async function AdminServiceRequestsPage() {
  const { userId } = await auth()

  if (!isAdminUser(userId)) {
    redirect('/admin')
  }

  return <ServiceRequestsManager />

}
