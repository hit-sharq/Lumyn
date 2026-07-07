"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./assistant-product-card.module.css";
interface Tab {
  id: string;
  label: string;
  icon: string;
  description: string;
}
const tabs: Tab[] = [{
  id: "customer",
  label: "Customer View",
  icon: "👤",
  description: "Real-time conversation experience"
}, {
  id: "business",
  label: "Business View",
  icon: "📊",
  description: "Inventory & data integration"
}, {
  id: "developer",
  label: "Developer View",
  icon: "⚙️",
  description: "Secure webhook infrastructure"
}];
export default function AiWhatsappAssistantCard() {
  const [activeTab, setActiveTab] = useState<string>("customer");
  return <section className={styles.productSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.kicker}>✨ NEW PRODUCT</span>
          <h2 className={styles.title}>
            <span className={styles.titleGradient}>AI WhatsApp Business Assistant</span>
          </h2>
          <p className={styles.subtitle}>
            24/7 automated customer support with instant inventory lookups and local payment processing — zero infrastructure overhead.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.badges}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🤖</span>
              <span className={styles.badgeText}>
                <span className={styles.badgeTitle}>24/7 Support</span>
                <span className={styles.badgeDesc}>Always-available automation</span>
              </span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>⚡</span>
              <span className={styles.badgeText}>
                <span className={styles.badgeTitle}>$0 Overhead</span>
                <span className={styles.badgeDesc}>No servers, no maintenance</span>
              </span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>💳</span>
              <span className={styles.badgeText}>
                <span className={styles.badgeTitle}>Local Payments</span>
                <span className={styles.badgeDesc}>M-Pesa, Airtel Money, etc.</span>
              </span>
            </div>
          </div>

          <div className={styles.tabsWrap}>
            <div className={styles.tabHeader}>
              {tabs.map(tab => <button key={tab.id} className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(tab.id)}>
                  <div className={styles.tabButtonTop}>
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabLabel}>
                      <strong>{tab.label}</strong>
                      <span>{tab.description}</span>
                    </span>
                  </div>
                  <span className={styles.tabUnderline}></span>
                </button>)}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "customer" && <motion.div key="customer" className={styles.tabPanel} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.35
            }}>
                  <div className={styles.panelInner}>
                    <div className={styles.panelGrid}>
                      <div>
                        <h3 className={styles.panelTitle}>Real-Time Conversation</h3>
                        <p className={styles.panelText}>
                          Customers get instant, human-like responses without waiting. The AI understands context,
                          handles queries naturally, and maintains conversation flow.
                        </p>
                        <div className={styles.mockPhone}>
                          <div className={styles.phoneHeader}>
                            <div className={styles.dots}>
                              <span className={`${styles.dot} ${styles.dotRed}`}></span>
                              <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                              <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                            </div>
                            <span className={styles.label}>Customer Chat</span>
                          </div>
                          <div className={styles.chat}>
                            <div className={styles.bubbleRow}>
                              <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                                Hi, do you have the iPhone 15 Pro in blue?
                              </div>
                            </div>
                            <div className={styles.bubbleRow}>
                              <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                                Yes! iPhone 15 Pro (Blue, 256GB) is in stock.
                                <span className={styles.aiReplyEmphasis}> KSh 125,000</span> — includes
                                1-year warranty. Would you like to reserve one?
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={styles.insightCard}>
                          <h3 className={styles.insightTitle}>
                            <span>⚡</span> Key Benefits
                          </h3>
                          <ul className={styles.insightList}>
                            <li>Instant responses (under 2 seconds)</li>
                            <li>24/7 availability, no downtime</li>
                            <li>Multi-language support</li>
                            <li>Smart conversation context</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}

              {activeTab === "business" && <motion.div key="business" className={styles.tabPanel} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.35
            }}>
                  <div className={styles.panelInner}>
                    <div className={styles.panelGrid}>
                      <div>
                        <h3 className={styles.panelTitle}>Smart Inventory Integration</h3>
                        <p className={styles.panelText}>
                          The AI connects to your Google Sheets or database in real-time, providing
                          accurate product availability, pricing, and stock levels instantly.
                        </p>
                        <div className={styles.mockPhone}>
                          <div className={styles.phoneHeader}>
                            <div className={styles.dots}>
                              <span className={`${styles.dot} ${styles.dotRed}`}></span>
                              <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                              <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                            </div>
                            <span className={styles.label}>Business Dashboard</span>
                          </div>
                          <div className={styles.chat}>
                            <div className={styles.bubbleRow}>
                              <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                                <strong>Query:</strong> &quot;iPhone 15 Pro blue stock?&quot;
                                <br />
                                <strong>Source:</strong> Google Sheet sync
                                <br />
                                <strong>Result:</strong>{" "}
                                <span className={styles.aiReplyEmphasis}>Available: 12 units</span>
                              </div>
                            </div>
                            <div className={styles.bubbleRow}>
                              <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                                Price updated: KSh 125,000
                                <br />
                                Category: Mobile Phones
                                <br />
                                SKU: IP15PRO-BLUE-256
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={styles.insightCard}>
                          <h3 className={styles.insightTitle}>
                            <span>📊</span> Integration Points
                          </h3>
                          <ul className={styles.insightList}>
                            <li>Google Sheets (instant sync)</li>
                            <li>PostgreSQL, Firebase, Redis</li>
                            <li>REST API endpoints</li>
                            <li>Real-time webhook updates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}

              {activeTab === "developer" && <motion.div key="developer" className={styles.tabPanel} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.35
            }}>
                  <div className={styles.panelInner}>
                    <div className={styles.panelGrid}>
                      <div>
                        <h3 className={styles.panelTitle}>Serverless Webhook Architecture</h3>
                        <p className={styles.panelText}>
                          Minimal, secure infrastructure handles Meta&apos;s webhook verification and message
                          processing. Scale to thousands of conversations without managing servers.
                        </p>
                        <pre className={styles.codeBlock}>
                          <code>
{`// GET /api/whatsapp/webhook
verify: mode -> challenge response

// POST /api/whatsapp/webhook  
1. Receive WhatsApp message
2. Extract from, body
3. Query Gemini 1.5 Flash
4. POST reply to WhatsApp Cloud API`}
                          </code>
                        </pre>
                      </div>
                      <div>
                        <div className={styles.insightCard}>
                          <h3 className={styles.insightTitle}>
                            <span>🔐</span> Security & Performance
                          </h3>
                          <ul className={styles.insightList}>
                            <li>Webhook signature verification</li>
                            <li>Gemini 1.5 Flash (free tier)</li>
                            <li>Zero infrastructure cost</li>
                            <li>Auto-scaling serverless</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>

          <div className={styles.trialCta}>
            <div className={styles.trialText}>
              <strong>Start your free 7-day trial</strong>
              <span>No setup fees. No credit card required. Cancel anytime.</span>
            </div>
            <Link href="/contact?product=whatsapp-assistant" className={styles.trialButton}>
              Deploy Free Trial
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>;
}