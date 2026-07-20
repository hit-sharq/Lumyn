import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ShareButton from "@/components/ShareButton"
import styles from "./article.module.css"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const res = await fetch(`${BASE_URL}/api/news/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return { title: "News Article | Lumyn" }
    const article: any = await res.json()
    const url = `${BASE_URL}/news/${id}`
    return {
      title: `${article.title} | Lumyn News`,
      description: `Read this news article: ${article.title} by ${article.author}`,
      authors: [{ name: article.author }],
      openGraph: {
        title: article.title,
        description: `Read this news article: ${article.title} by ${article.author}`,
        url,
        siteName: "Lumyn",
        type: "article",
        images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: `Read this news article: ${article.title} by ${article.author}`,
        images: article.image ? [article.image] : undefined,
        creator: "@LumynTec",
      },
      alternates: { canonical: url },
    }
  } catch {
    return { title: "News Article | Lumyn" }
  }
}

async function getArticle(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/news/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function NewsArticleJsonLd({ article, url }: { article: any; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: `Read this news article: ${article.title} by ${article.author}`,
    image: article.image || `${BASE_URL}/og-image.png`,
    datePublished: article.createdAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Lumyn Technologies",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/placeholder-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  const url = `${BASE_URL}/news/${id}`

  return (
    <div className={styles.articlePage}>
      <NewsArticleJsonLd article={article} url={url} />
      <article className={styles.article} itemScope itemType="https://schema.org/NewsArticle">
        <meta itemProp="author" content={article.author} />
        <meta itemProp="datePublished" content={article.createdAt} />

        <div className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className={styles.title} itemProp="headline">{article.title}</h1>
          <div className={styles.author}>By {article.author}</div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={article.image || "/placeholder.svg?height=600&width=1200&query=news article"}
            alt={article.title}
            fill
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner} dangerouslySetInnerHTML={{ __html: article.content }} itemProp="articleBody" />
        </div>

        <div className={styles.shareSection}>
          <ShareButton
            title={article.title}
            text={`Read this news article: ${article.title} by ${article.author}`}
            image={article.image}
          />
        </div>

        <div className={styles.backButton}>
          <Link href="/news" className={styles.backBtn}>
            ← Back to News
          </Link>
        </div>
      </article>
    </div>
  )
}
