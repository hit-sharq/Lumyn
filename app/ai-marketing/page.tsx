"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useUser, SignInButton } from "@clerk/nextjs";
import styles from "./page.module.css";
import { PublicContentGenerator } from "./components/public-content-generator";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.lumyn.co.ke"

  const pageMetadata = {
  title: "AI Marketing Suite | Lumyn — AI-Powered Content Generator & Campaign Builder",
  description: "Generate marketing copy, build multi-channel campaigns, and optimize content with AI. Start free, upgrade for unlimited access.",
  url: `${SITE_URL}/ai-marketing`,
  ogImage: `${SITE_URL}/og-image.png`,
}

export default function AIMarketingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [activeTool, setActiveTool] = useState<string>("generate");
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setHasSubscription(false)
      return
    }

    fetch("/api/ai-marketing/subscription")
      .then((res) => res.json())
      .then((data) => setHasSubscription(data.hasSubscription))
      .catch(() => setHasSubscription(false))
  }, [isSignedIn])

  const openTool = (id: string) => {
    setActiveTool(id);
    const el = document.getElementById("ai-tools");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tools = [
    { id: "generate", label: "Generate" },
    { id: "campaign", label: "Campaign Builder" },
    { id: "templates", label: "Templates" },
    { id: "optimizer", label: "Optimizer" },
  ];

  const handleUpgrade = async (plan: string, amount: number) => {
    if (!isSignedIn) {
      openTool("generate");
      return;
    }

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ai_marketing_subscription",
          itemId: plan,
          amount: amount.toString(),
          currency: "KES",
          description: `Lumyn AI Marketing — ${plan} plan`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initiation failed");
      window.location.href = data.redirect_url;
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lumyn AI Marketing",
    description: pageMetadata.description,
    url: pageMetadata.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "KES",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "2900",
        priceCurrency: "KES",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "120",
    },
  }

  return (
    <>
      <Head>
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
        <link rel="canonical" href={pageMetadata.url} />
        <meta property="og:title" content={pageMetadata.title} />
        <meta property="og:description" content={pageMetadata.description} />
        <meta property="og:url" content={pageMetadata.url} />
        <meta property="og:image" content={pageMetadata.ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMetadata.title} />
        <meta name="twitter:description" content={pageMetadata.description} />
        <meta name="twitter:image" content={pageMetadata.ogImage} />
      </Head>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            AI-Powered Marketing
          </div>
          <h1 className={styles.heroTitle}>
            Marketing Copy, <span className={styles.titleGradient}>In Seconds</span>
          </h1>
          <p className={styles.heroDescription}>
            Create engaging social posts, emails, and ad copy with AI. Then optimize for maximum engagement. Start free — no credit card required.
          </p>
          <div className={styles.heroButtons}>
            <button onClick={() => openTool("generate")} className={styles.primaryButton}>
              Start Generating
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className={styles.secondaryButton}>Sign In</button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section id="ai-tools" className={styles.toolsSection}>
        <div className={styles.toolsContainer}>
          <span className={styles.sectionLabel}>Product</span>
          <h2 className={styles.sectionTitle}>Try Our AI Marketing Tools</h2>
          <p className={styles.sectionSubtitle}>
            Pick a tool below and start creating instantly. Upgrade for unlimited access.
          </p>

          <div className={styles.toolsTabs}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => openTool(tool.id)}
                className={`${styles.toolTab} ${activeTool === tool.id ? styles.toolTabActive : ""}`}
              >
                {tool.label}
              </button>
            ))}
          </div>

          <div className={styles.toolPanel}>
            {activeTool === "generate" && (
              <div>
                <h3 className={styles.toolPanelTitle}>AI Content Generator</h3>
                <p className={styles.toolPanelDescription}>
                  Generate marketing copy for any platform and content type. Start with free generations, upgrade for unlimited access.
                </p>
                <PublicContentGenerator
                  onGenerate={(content) => console.log("Generated:", content)}
                />
              </div>
            )}

            {activeTool === "campaign" && (
              <div>
                <h3 className={styles.toolPanelTitle}>Campaign Builder</h3>
                <p className={styles.toolPanelDescription}>
                  Build multi-channel campaign blueprints with AI. Logged-in users can save campaigns and access the full builder.
                </p>
                <div className={styles.toolPanelActions}>
                  <Link href="/admin/ai-marketing" className={styles.primaryButton}>
                    Open Campaign Builder
                  </Link>
                  {isLoaded && !isSignedIn && (
                    <SignInButton mode="modal">
                      <button className={styles.secondaryButton}>Sign In</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            )}

            {activeTool === "templates" && (
              <div>
                <h3 className={styles.toolPanelTitle}>Templates Gallery</h3>
                <p className={styles.toolPanelDescription}>
                  Browse AI-generated marketing templates. Sign in to save, reuse, and manage your own templates.
                </p>
                <div className={styles.toolPanelActions}>
                  <Link href="/admin/ai-marketing" className={styles.primaryButton}>
                    View Templates
                  </Link>
                  {isLoaded && !isSignedIn && (
                    <SignInButton mode="modal">
                      <button className={styles.secondaryButton}>Sign In</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            )}

            {activeTool === "optimizer" && (
              <div>
                <h3 className={styles.toolPanelTitle}>Content Optimizer</h3>
                <p className={styles.toolPanelDescription}>
                  Paste content to get optimization suggestions, A/B variations, and platform-native rewrites.
                </p>
                <div className={styles.toolPanelActions}>
                  <Link href="/admin/ai-marketing" className={styles.primaryButton}>
                    Try Optimizer
                  </Link>
                  {isLoaded && !isSignedIn && (
                    <SignInButton mode="modal">
                      <button className={styles.secondaryButton}>Sign In</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingContainer}>
          <h2 className={styles.pricingTitle}>Simple, Transparent Pricing</h2>
          <p className={styles.pricingSubtitle}>
            Start free, upgrade when you need more.
          </p>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingName}>Free</h3>
              <p className={styles.pricingPrice}>$0</p>
              <ul className={styles.pricingFeatures}>
                <li>5 generations/month</li>
                <li>Basic templates</li>
                <li>Single platform</li>
                <li className="disabled">No A/B testing</li>
                <li className="disabled">No analytics</li>
              </ul>
              <button onClick={() => openTool("generate")} className={`${styles.pricingButton} ${styles.pricingButtonSecondary}`}>
                Get Started
              </button>
            </div>

            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.popularBadge}>Popular</div>
              <h3 className={styles.pricingName}>Pro</h3>
              <p className={styles.pricingPrice}>
                $29 <span>/mo</span>
              </p>
              <ul className={styles.pricingFeatures}>
                <li>Unlimited generations</li>
                <li>Advanced templates</li>
                <li>All platforms</li>
                <li>A/B testing</li>
                <li>Basic analytics</li>
              </ul>
              <button onClick={() => handleUpgrade("pro", 2900)} className={`${styles.pricingButton} ${styles.pricingButtonPrimary}`}>
                Upgrade to Pro
              </button>
            </div>

            <div className={styles.pricingCard}>
              <h3 className={styles.pricingName}>Enterprise</h3>
              <p className={styles.pricingPrice}>Custom</p>
              <ul className={styles.pricingFeatures}>
                <li>Everything in Pro</li>
                <li>API access</li>
                <li>Custom training</li>
                <li>Advanced analytics</li>
                <li>24/7 support</li>
              </ul>
              <Link href="/contact" className={`${styles.pricingButton} ${styles.pricingButtonSecondary}`}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={`${styles.ctaGlow} ${styles.ctaGlow1}`} />
          <div className={`${styles.ctaGlow} ${styles.ctaGlow2}`} />
        </div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to <span className={styles.ctaHighlight}>Transform</span> Your Marketing?
          </h2>
          <p className={styles.ctaText}>
            Join thousands of creators and marketers using AI to save time and boost engagement.
          </p>
          <div className={styles.ctaButtons}>
            <button onClick={() => openTool("generate")} className={styles.ctaPrimaryButton}>
              Start Free Trial
            </button>
            <Link href="/contact" className={styles.ctaSecondaryButton}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
