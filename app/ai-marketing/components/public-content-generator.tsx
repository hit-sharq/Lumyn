"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import styles from "./public-content-generator.module.css";

export function PublicContentGenerator({
  onGenerate,
  hasSubscription = false,
}: {
  onGenerate?: (content: string) => void;
  hasSubscription?: boolean;
}) {
  const { isSignedIn } = useUser();
  const [contentType, setContentType] = useState<string>("social_post");
  const [platform, setPlatform] = useState<string>("twitter");
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("professional");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);
  const maxFreeGenerations = 5

  const isLimited = !hasSubscription
  const displayLimit = isLimited ? maxFreeGenerations : Infinity

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      if (!hasSubscription && usageCount >= maxFreeGenerations) {
        setError(
          `Free tier limit reached. You've used ${usageCount} of ${maxFreeGenerations} free generations.`
        );
        return;
      }

      if (!topic.trim()) {
        setError("Please enter a topic");
        return;
      }

      const response = await fetch("/api/ai-marketing/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "public-user",
        },
        body: JSON.stringify({
          contentType,
          platform,
          topic,
          tone,
          saveAsTemplate: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setUsageCount((prev) => prev + 1);
      onGenerate?.(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.generator}>
      <div className={styles.usageCounter}>
        <div className={styles.usageInfo}>
          <p className={styles.usageTitle}>
            {hasSubscription ? "Pro Plan" : "Free Tier Usage"}
          </p>
          <p className={styles.usageCount}>
            {hasSubscription
              ? "Unlimited generations"
              : `${usageCount} of ${maxFreeGenerations} generations used`}
          </p>
          {!hasSubscription && (
            <div className={styles.usageBar}>
              <div
                className={styles.usageBarFill}
                style={{ width: `${(usageCount / maxFreeGenerations) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className={styles.formSelect}
          >
            <option value="social_post">Social Post</option>
            <option value="email_short">Email (Short)</option>
            <option value="email_long">Email (Long)</option>
            <option value="ad_copy">Ad Copy</option>
            <option value="landing_page">Landing Page Copy</option>
            <option value="blog_post">Blog Post</option>
            <option value="hashtags">Hashtags</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={styles.formSelect}
          >
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="email">Email</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={styles.formSelect}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="urgent">Urgent</option>
            <option value="friendly">Friendly</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Launching a new SaaS product"
            className={styles.formInput}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || (!hasSubscription && usageCount >= maxFreeGenerations)}
        className={styles.generateButton}
      >
        {loading ? "Generating..." : "Generate Content"}
      </button>

      {error && <div className={styles.errorBox}>{error}</div>}

      {generatedContent && (
        <div style={{ marginTop: "24px" }}>
          <label className={styles.formLabel}>Generated Content</label>
          <div className={styles.generatedBox}>{generatedContent}</div>
          <div className={styles.actionButtons}>
            <button
              onClick={() => navigator.clipboard.writeText(generatedContent)}
              className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
            >
              Copy
            </button>
            <button
              onClick={() => {
                setGeneratedContent("");
                setTopic("");
              }}
              className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            >
              New Generation
            </button>
          </div>
        </div>
      )}

      {!hasSubscription && usageCount >= maxFreeGenerations && (
        <div className={styles.upgradeBox}>
          <h3 className={styles.upgradeTitle}>Upgrade for Unlimited Generations</h3>
          <p className={styles.upgradeText}>
            Get unlimited content generation, template management, and campaign planning tools.
          </p>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className={`${styles.actionButton} ${styles.actionButtonPrimary}`}>
                Sign In to Upgrade
              </button>
            </SignInButton>
          ) : (
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/payments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "ai_marketing_subscription",
                      itemId: "pro",
                      amount: "2900",
                      currency: "KES",
                      description: "Lumyn AI Marketing — Pro plan",
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Payment initiation failed");
                  window.location.href = data.redirect_url;
                } catch (err: any) {
                  alert(err.message || "Something went wrong. Please try again.");
                }
              }}
              className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            >
              Upgrade to Pro — KES 2,900
            </button>
          )}
        </div>
      )}
    </div>
  );
}
