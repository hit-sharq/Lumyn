import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ShareButton from "@/components/ShareButton"
import styles from "./post.module.css"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const res = await fetch(`${BASE_URL}/api/blog/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return { title: "Blog Post | Lumyn" }
    const post: any = await res.json()
    const url = `${BASE_URL}/blog/${id}`
    return {
      title: `${post.title} | Lumyn Blog`,
      description: post.excerpt || `Read this blog post: ${post.title} by ${post.author}`,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read this blog post: ${post.title} by ${post.author}`,
        url,
        siteName: "Lumyn",
        type: "article",
        images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || `Read this blog post: ${post.title} by ${post.author}`,
        images: post.image ? [post.image] : undefined,
        creator: "@LumynTec",
      },
      alternates: { canonical: url },
    }
  } catch {
    return { title: "Blog Post | Lumyn" }
  }
}

async function getPost(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/blog/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function BlogPostJsonLd({ post, url }: { post: any; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || `Read this blog post: ${post.title} by ${post.author}`,
    image: post.image || `${BASE_URL}/og-image.png`,
    datePublished: post.createdAt,
    author: {
      "@type": "Person",
      name: post.author,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  const url = `${BASE_URL}/blog/${id}`

  return (
    <div className={styles.postPage}>
      <BlogPostJsonLd post={post} url={url} />
      <article className={styles.post} itemScope itemType="https://schema.org/Article">
        <meta itemProp="author" content={post.author} />
        <meta itemProp="datePublished" content={post.createdAt} />

        <div className={styles.postHeader}>
          <div className={styles.postMeta}>
            <span className={styles.author}>By {post.author}</span>
            <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className={styles.title} itemProp="headline">{post.title}</h1>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={post.image || "/placeholder.svg?height=600&width=1200&query=blog post"}
            alt={post.title}
            fill
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner} dangerouslySetInnerHTML={{ __html: post.content }} itemProp="articleBody" />
        </div>

        <div className={styles.shareSection}>
          <ShareButton
            title={post.title}
            text={`Check out this blog post: ${post.title} by ${post.author}`}
            image={post.image}
          />
        </div>

        <div className={styles.backButton}>
          <Link href="/blog" className={styles.backBtn}>
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
