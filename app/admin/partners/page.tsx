import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import PartnersManager from '../components/partners-manager'
import { isAdminUser } from '@/lib/admin'

export default async function AdminPartnersPage() {
  const { userId } = await auth()

  if (!isAdminUser(userId)) {
    redirect('/admin')
  }

  return <PartnersManager />

}
