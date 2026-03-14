import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ClientComponent from './ClientComponent'
import styles from './callback.module.css'

export interface PaymentStatusData {
  status: string
  order?: any
  pesapalStatus?: any
}

export interface PageProps {
  searchParams: {
    type?: string
    itemId?: string
    ref?: string
    OrderTrackingId?: string
  }
}

export default async function PaymentCallbackPage({ searchParams }: PageProps) {
  const { type, ref } = searchParams

  if (!ref) {
    notFound()
  }

  const redirectPath = (() => {
    if (type === "studio_template") return "/studio"
    if (type === "market_product") return "/market"
    if (type === "job_post") return "/hire"
    return "/"
  })()

  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.spinner} />
          <h1 className={styles.title}>Verifying Payment...</h1>
          <p className={styles.text}>Please wait while we confirm your payment with Pesapal.</p>
        </div>
      </div>
    }>
      <ClientComponent 
        initialStatus="loading" 
        initialMessage="" 
        type={type} 
        redirectPath={redirectPath} 
      />
    </Suspense>
  )
}
