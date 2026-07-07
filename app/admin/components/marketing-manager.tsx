"use client"

import styles from "../growth.module.css"

export default function MarketingManager() {
  return (
    <main className={styles.growthPage}>
      <div className={styles.growthHeader}>
        <h1 className={styles.growthTitle}>Marketing Command Center</h1>
        <p className={styles.growthSubtitle}>
          Send newsletters, SMS blasts, and push notifications to your user base.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>Newsletter Blast</h2>
            <p className={styles.growthCardSubtitle}>
              Send an email to all users or a targeted segment.
            </p>
            <form action="/api/marketing/newsletter" method="POST" className="mt-6 space-y-4">
              <div>
                <label htmlFor="subject" className={styles.growthLabel}>Subject</label>
                <input type="text" id="subject" name="subject" required className={styles.growthInput} />
              </div>
              <div>
                <label htmlFor="body" className={styles.growthLabel}>Body (HTML supported)</label>
                <textarea id="body" name="body" required rows={6} className={styles.growthInput} />
              </div>
              <div>
                <label htmlFor="segment" className={styles.growthLabel}>Segment</label>
                <select id="segment" name="segment" className={styles.growthInput}>
                  <option value="all">All Users</option>
                  <option value="creators">Creators Only</option>
                  <option value="employers">Employers Only</option>
                  <option value="pro">Pro Subscribers</option>
                </select>
              </div>
              <button type="submit" className={styles.growthButton}>Send Newsletter</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>SMS Blast</h2>
            <p className={styles.growthCardSubtitle}>Send SMS to users with phone numbers.</p>
            <form action="/api/marketing/sms-blast" method="POST" className="mt-6 space-y-4">
              <div>
                <label htmlFor="smsMessage" className={styles.growthLabel}>Message</label>
                <textarea id="smsMessage" name="message" required rows={4} className={styles.growthInput} />
              </div>
              <div>
                <label htmlFor="smsSegment" className={styles.growthLabel}>Segment</label>
                <select id="smsSegment" name="segment" className={styles.growthInput}>
                  <option value="all">All Users</option>
                  <option value="creators">Creators Only</option>
                  <option value="employers">Employers Only</option>
                  <option value="pro">Pro Subscribers</option>
                </select>
              </div>
              <button type="submit" className={styles.growthButton}>Send SMS Blast</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={styles.growthCard}>
            <h2 className={styles.growthCardTitle}>Push Notification</h2>
            <p className={styles.growthCardSubtitle}>Send push notification to opted-in users.</p>
            <form action="/api/marketing/push-blast" method="POST" className="mt-6 space-y-4">
              <div>
                <label htmlFor="pushTitle" className={styles.growthLabel}>Title</label>
                <input type="text" id="pushTitle" name="title" required className={styles.growthInput} />
              </div>
              <div>
                <label htmlFor="pushMessage" className={styles.growthLabel}>Message</label>
                <textarea id="pushMessage" name="message" required rows={3} className={styles.growthInput} />
              </div>
              <div>
                <label htmlFor="pushSegment" className={styles.growthLabel}>Segment</label>
                <select id="pushSegment" name="segment" className={styles.growthInput}>
                  <option value="all">All Users</option>
                  <option value="creators">Creators Only</option>
                  <option value="employers">Employers Only</option>
                  <option value="pro">Pro Subscribers</option>
                </select>
              </div>
              <button type="submit" className={styles.growthButton}>Send Push Notification</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
