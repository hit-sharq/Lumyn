import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ProposalsManager from '../components/proposals-manager'
import { isAdminUser } from '@/lib/admin'

export default async function AdminProposalsPage() {
  const { userId } = await auth()

  if (!isAdminUser(userId)) {
    redirect('/admin')
  }

  return <ProposalsManager />

}
