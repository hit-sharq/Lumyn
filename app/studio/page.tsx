import StudioClient from './studio-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio - Lumyn',
  description: 'Premium templates marketplace.',
}

export default function StudioPage() {
  return <StudioClient />
}

